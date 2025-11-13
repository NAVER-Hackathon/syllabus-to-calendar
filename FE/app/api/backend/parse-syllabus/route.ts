import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { query, queryOne } from "@/lib/db";

const UPLOAD_DIR = join(process.cwd(), "uploads");

// Backend service URL - configure in .env.local
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

interface ParseRequest {
  fileId: string;
  uploadId?: string;
}

/**
 * Next.js API route that acts as a proxy to the backend service
 * This route forwards parsing requests to your backend service which handles NAVER AI integration
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await requireAuth();

    // 2. Parse request body
    const body: ParseRequest = await request.json();
    const { fileId, uploadId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    // 3. Check if file exists
    const filePath = join(UPLOAD_DIR, fileId);
    if (!existsSync(filePath)) {
      // Update database status if record exists
      if (uploadId) {
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", "File not found on server", uploadId]
        );
      }
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 4. Read file and convert to base64
    const fileBuffer = await readFile(filePath);
    const base64File = fileBuffer.toString("base64");
    const fileType = fileId.split(".").pop()?.toLowerCase() || "pdf";

    // Determine MIME type
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
    };
    const mimeType = mimeTypes[fileType] || "application/pdf";

    // 5. Look up original file metadata if available
    let originalName = fileId;
    let storedMimeType: string | undefined;
    if (uploadId) {
      const uploadRecord = await queryOne<{
        original_name?: string;
        file_type?: string;
      }>("SELECT original_name, file_type FROM syllabus_uploads WHERE id = ?", [
        uploadId,
      ]);

      if (uploadRecord) {
        originalName = uploadRecord.original_name || originalName;
        storedMimeType = uploadRecord.file_type || storedMimeType;
      }
    }

    // 6. Update database status to "processing"
    if (uploadId) {
      await query("UPDATE syllabus_uploads SET status = ? WHERE id = ?", [
        "processing",
        uploadId,
      ]);
    }

    // 7. Forward request to backend service
    try {
      const backendResponse = await fetch(
        `${BACKEND_API_URL}/api/naver/parse-syllabus`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.userId}`, // Pass user context
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64File,
            fileName: originalName,
            mimeType: storedMimeType || mimeType,
            ...(uploadId ? { uploadId } : {}),
          }),
        }
      );

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({
          error: `Backend error: ${backendResponse.statusText}`,
        }));

        // Update database status on error
        if (uploadId) {
          await query(
            "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
            ["failed", errorData.error || "Backend service error", uploadId]
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: errorData.error || "Backend service error",
          },
          { status: backendResponse.status }
        );
      }

      const backendData = await backendResponse.json();

      // 8. Update database with parsed data
      if (uploadId) {
        await query(
          `UPDATE syllabus_uploads 
          SET status = ?, parsed_data = ?, error_message = NULL 
          WHERE id = ?`,
          [
            backendData.success ? "completed" : "failed",
            backendData.success ? JSON.stringify(backendData.data) : null,
            uploadId,
          ]
        );
      }

      // 9. Return response to frontend (match backend contract)
      return NextResponse.json(backendData);
    } catch (fetchError) {
      // Handle network errors or backend unavailability
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to connect to backend service";

      // Update database status
      if (uploadId) {
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", errorMessage, uploadId]
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error) {
    console.error("Parse proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
