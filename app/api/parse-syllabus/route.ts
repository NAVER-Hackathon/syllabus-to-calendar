import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { query, queryOne } from "@/lib/db";

// This is a placeholder for NAVER AI integration
// You'll need to implement actual CLOVA OCR and CLOVA Studio API calls

const UPLOAD_DIR = join(process.cwd(), "uploads");

interface ParseRequest {
  fileId: string;
  uploadId?: string;
}

interface UpdateUploadRequest {
  uploadId: string;
  courseId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ParseRequest = await request.json();
    const { fileId, uploadId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    // Get upload record from database if uploadId provided
    let uploadRecord = null;
    if (uploadId) {
      uploadRecord = await queryOne(
        "SELECT * FROM syllabus_uploads WHERE id = ?",
        [uploadId]
      );
    }

    // Check if file exists
    const filePath = join(UPLOAD_DIR, fileId);
    if (!existsSync(filePath)) {
      // Update database status if record exists
      if (uploadId) {
        await query(
          "UPDATE syllabus_uploads SET status = ?, error_message = ? WHERE id = ?",
          ["failed", "File not found on server", uploadId]
        );
      }
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    const fileType = fileId.split(".").pop()?.toLowerCase();

    // TODO: Implement NAVER CLOVA OCR integration
    // 1. Call CLOVA OCR API to extract text from PDF/image
    // 2. Call CLOVA Studio API to extract structured data
    // 3. Parse dates, assignments, exams, etc.

    // Placeholder response structure
    // In production, this would call:
    // - CLOVA OCR API: https://api.ncloud.com/ocr/v1/document
    // - CLOVA Studio API: https://clovastudio.apigw.ntruss.com/...
    
    // For now, return a mock response
    const mockParsedData = {
      courseName: "Example Course",
      courseCode: "CS101",
      term: "Fall 2025",
      instructor: "Dr. Smith",
      startDate: new Date("2025-09-01").toISOString(),
      endDate: new Date("2025-12-15").toISOString(),
      assignments: [
        {
          title: "Assignment 1",
          dueDate: new Date("2025-09-15").toISOString(),
          description: "Complete exercises 1-5",
        },
      ],
      exams: [
        {
          title: "Midterm Exam",
          date: new Date("2025-10-15").toISOString(),
          time: "10:00 AM",
        },
      ],
      classSchedule: [
        {
          dayOfWeek: 1, // Monday
          startTime: "09:00",
          endTime: "10:30",
          location: "Room 101",
        },
      ],
    };

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Replace with actual parsing logic
    // For now, randomly succeed or fail to demonstrate error handling
    const shouldSucceed = Math.random() > 0.2; // 80% success rate for demo

    if (shouldSucceed) {
      // Save parsed data to database
      if (uploadId) {
        try {
          await query(
            `UPDATE syllabus_uploads 
            SET status = ?, parsed_data = ? 
            WHERE id = ?`,
            [
              "completed",
              JSON.stringify(mockParsedData),
              uploadId,
            ]
          );
        } catch (dbError) {
          console.error("Database update error:", dbError);
        }
      }

      return NextResponse.json({
        success: true,
        parsedData: mockParsedData,
        confidence: 0.85,
        uploadId: uploadId || null,
      });
    } else {
      // Update database status on failure
      if (uploadId) {
        try {
          await query(
            `UPDATE syllabus_uploads 
            SET status = ?, error_message = ? 
            WHERE id = ?`,
            [
              "failed",
              "Failed to extract data from syllabus. Please try manual entry.",
              uploadId,
            ]
          );
        } catch (dbError) {
          console.error("Database update error:", dbError);
        }
      }

      return NextResponse.json({
        success: false,
        error: "Failed to extract data from syllabus. Please try manual entry.",
      });
    }
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to parse syllabus",
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
      await query(
        "UPDATE syllabus_uploads SET course_id = ? WHERE id = ?",
        [courseId, uploadId]
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Update upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update upload",
      },
      { status: 500 }
    );
  }
}

