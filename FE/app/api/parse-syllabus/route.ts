import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { join } from "path";
import { readFile, unlink } from "fs/promises";
import { query, queryOne } from "@/lib/db";
import { NormalizedSyllabusResult, ParsedSyllabus } from "@/types/syllabus";
import { normalizedToParsedSyllabus } from "@/lib/syllabus-normalizer";

// Use /tmp directory on Vercel serverless, local uploads directory otherwise
const UPLOAD_DIR = process.env.VERCEL
  ? join("/tmp", "uploads")
  : join(process.cwd(), "uploads");
const getBackendApiUrl = () =>
  (process.env.BACKEND_API_URL || "http://localhost:3001").replace(/\/$/, "");

interface ParseRequest {
  fileId: string;
  uploadId?: string;
}

interface UpdateUploadRequest {
  uploadId: string;
  courseId?: string;
}

export async function POST(request: NextRequest) {
  let filePath: string | null = null;
  try {
    const body: ParseRequest = await request.json();
    const { fileId, uploadId } = body;

    console.log("[parse-syllabus] Request received:", {
      fileId,
      uploadId,
      backendUrl: getBackendApiUrl(),
    });

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "fileId is required" },
        { status: 400 }
      );
    }

    // Try to read from filesystem first (for same-function uploads)
    const resolvedFilePath = join(UPLOAD_DIR, fileId);
    filePath = resolvedFilePath;

    let fileBuffer: Buffer;

    // Check filesystem first
    if (existsSync(resolvedFilePath)) {
      console.log(
        "[parse-syllabus] Reading file from filesystem:",
        resolvedFilePath
      );
      fileBuffer = await readFile(resolvedFilePath);
    } else if (uploadId) {
      // If not in filesystem, try to get from database (cross-function scenario)
      console.log(
        "[parse-syllabus] File not in filesystem, querying database for uploadId:",
        uploadId
      );
      const upload = await queryOne(
        "SELECT file_content FROM syllabus_uploads WHERE id = ?",
        [uploadId]
      );

      if (!upload || !upload.file_content) {
        console.error(
          "[parse-syllabus] File not found in database for uploadId:",
          uploadId
        );
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", "File not found on server or in database", uploadId]
        );

        return NextResponse.json(
          { success: false, error: "File not found" },
          { status: 404 }
        );
      }

      console.log(
        "[parse-syllabus] File retrieved from database, size:",
        upload.file_content.length
      );
      fileBuffer = Buffer.from(upload.file_content);
    } else {
      // No uploadId and no file in filesystem
      console.error("[parse-syllabus] No uploadId and no file in filesystem");
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }
    let shouldCleanupFile = true;
    const cleanupUploadedFile = async () => {
      if (!shouldCleanupFile) return;
      shouldCleanupFile = false;
      try {
        await unlink(resolvedFilePath);
      } catch (cleanupError) {
        console.warn("Failed to remove uploaded file:", cleanupError);
      }
    };
    const originalName = resolvedFilePath.split("/").pop() || fileId;
    const mimeType = originalName.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : originalName.toLowerCase().match(/\.(png|jpg|jpeg)$/)
      ? "image/png"
      : "application/octet-stream";

    const formData = new FormData();
    formData.append(
      "image",
      new Blob([new Uint8Array(fileBuffer)], { type: mimeType }),
      originalName
    );

    const backendUrl = `${getBackendApiUrl()}/process-syllabus`;
    console.log("[parse-syllabus] Sending to backend:", {
      backendUrl,
      fileSize: fileBuffer.length,
      mimeType,
      originalName,
    });

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    console.log(
      "[parse-syllabus] Backend response status:",
      backendResponse.status
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("[parse-syllabus] Backend error:", {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        errorText,
      });
      if (uploadId) {
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", "Backend service error", uploadId]
        );
      }
      await cleanupUploadedFile();
      return NextResponse.json(
        {
          success: false,
          error: `Backend service failed: ${
            errorText || backendResponse.statusText
          }`,
        },
        { status: backendResponse.status }
      );
    }

    const normalized: NormalizedSyllabusResult = await backendResponse.json();

    if (!normalized.success) {
      if (uploadId) {
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", normalized.error || "AI parsing failed", uploadId]
        );
      }

      await cleanupUploadedFile();
      return NextResponse.json(
        { success: false, error: normalized.error || "AI parsing failed" },
        { status: 502 }
      );
    }

    const parsedData: ParsedSyllabus = normalizedToParsedSyllabus(
      normalized.data
    );

    if (uploadId) {
      try {
        await query(
          `UPDATE syllabus_uploads 
            SET status = ?, parsed_data = ? 
            WHERE id = ?`,
          ["completed", JSON.stringify(parsedData), uploadId]
        );
      } catch (dbError) {
        console.error("Database update error:", dbError);
      }
    }

    await cleanupUploadedFile();
    return NextResponse.json({
      success: true,
      parsedData,
      uploadId: uploadId || null,
    });
  } catch (error) {
    console.error("[parse-syllabus] Parse error:", error);
    console.error("[parse-syllabus] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      backendUrl: getBackendApiUrl(),
    });
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (cleanupError) {
        // ignore cleanup errors in catch
      }
    }
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to parse syllabus",
      },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update upload with course ID
export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateUploadRequest = await request.json();
    const { uploadId, courseId } = body;

    if (!uploadId) {
      return NextResponse.json(
        { error: "uploadId is required" },
        { status: 400 }
      );
    }

    // Update upload record with course ID
    if (courseId) {
      await query("UPDATE syllabus_uploads SET course_id = ? WHERE id = ?", [
        courseId,
        uploadId,
      ]);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Update upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update upload",
      },
      { status: 500 }
    );
  }
}
