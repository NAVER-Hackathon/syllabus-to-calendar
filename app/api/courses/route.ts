import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { query, queryOne } from "@/lib/db";
import { randomUUID } from "crypto";
import { getWeekNumber, getWeeksBetween } from "@/lib/date-utils";
import { COURSE_COLORS } from "@/constants/config";

interface CreateCourseRequest {
  name: string;
  code?: string;
  term?: string;
  instructor?: string;
  startDate: string;
  endDate: string;
  assignments?: Array<{
    title: string;
    dueDate: string;
    description?: string;
  }>;
  exams?: Array<{
    title: string;
    date: string;
    time?: string;
    location?: string;
  }>;
  classSchedule?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body: CreateCourseRequest = await request.json();

    // Validation
    if (!body.name || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Course name, start date, and end date are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Generate course ID and assign color
    const courseId = randomUUID();
    const colorIndex = Math.floor(Math.random() * COURSE_COLORS.length);
    const color = COURSE_COLORS[colorIndex];

    // Create course
    await query(
      `INSERT INTO courses 
      (id, user_id, name, code, term, instructor, start_date, end_date, color) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseId,
        session.userId,
        body.name,
        body.code || null,
        body.term || null,
        body.instructor || null,
        startDate,
        endDate,
        color,
      ]
    );

    // Create assignments
    if (body.assignments && body.assignments.length > 0) {
      for (const assignment of body.assignments) {
        if (!assignment.title || !assignment.dueDate) continue;

        const dueDate = new Date(assignment.dueDate);
        const weekNumber = getWeekNumber(dueDate, startDate);

        await query(
          `INSERT INTO assignments 
          (id, course_id, title, description, due_date, week_number, status, priority) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            courseId,
            assignment.title,
            assignment.description || null,
            dueDate,
            weekNumber,
            "pending",
            "medium",
          ]
        );
      }
    }

    // Create exams
    if (body.exams && body.exams.length > 0) {
      for (const exam of body.exams) {
        if (!exam.title || !exam.date) continue;

        const examDate = new Date(exam.date);
        const weekNumber = getWeekNumber(examDate, startDate);

        await query(
          `INSERT INTO exams 
          (id, course_id, title, date, time, location, week_number) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            courseId,
            exam.title,
            examDate,
            exam.time || null,
            exam.location || null,
            weekNumber,
          ]
        );
      }
    }

    // Create class schedules
    if (body.classSchedule && body.classSchedule.length > 0) {
      for (const schedule of body.classSchedule) {
        if (!schedule.startTime || !schedule.endTime) continue;

        await query(
          `INSERT INTO class_schedules 
          (id, course_id, day_of_week, start_time, end_time, location) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            courseId,
            schedule.dayOfWeek,
            schedule.startTime,
            schedule.endTime,
            schedule.location || null,
          ]
        );
      }
    }

    // Get created course
    const course = await queryOne(
      `SELECT id, name, code, term, instructor, start_date, end_date, color, created_at, updated_at 
       FROM courses WHERE id = ?`,
      [courseId]
    );

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create course",
      },
      { status: 500 }
    );
  }
}

// Get all courses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const courses = await query(
      `SELECT id, name, code, term, instructor, start_date, end_date, color, created_at, updated_at 
       FROM courses 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [session.userId]
    );

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get courses",
      },
      { status: 500 }
    );
  }
}

