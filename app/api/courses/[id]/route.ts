import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { resolveUserId } from "@/lib/user-resolver";
import { getPool } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const userId = await resolveUserId(session);
    const resolvedParams = await params;
    const courseId = resolvedParams?.id;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Remove dependent records first to satisfy FK constraints
    await pool.execute("DELETE FROM assignments WHERE course_id = ?", [
      courseId,
    ]);
    await pool.execute("DELETE FROM exams WHERE course_id = ?", [courseId]);
    await pool.execute("DELETE FROM milestones WHERE course_id = ?", [
      courseId,
    ]);
    await pool.execute("DELETE FROM class_schedules WHERE course_id = ?", [
      courseId,
    ]);
    await pool.execute(
      "UPDATE syllabus_uploads SET course_id = NULL WHERE course_id = ?",
      [courseId]
    );

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM courses WHERE id = ? AND user_id = ?",
      [courseId, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete course",
      },
      { status: 500 }
    );
  }
}

