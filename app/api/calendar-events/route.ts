// file: app/api/calendar-events/route.ts

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { query } from '@/lib/db';

// --- Interfaces (Commented out as they are not currently used) ---
/*
// Interface for Assignments and Exams
interface DbEventItem {
    id: string;
    title: string;
    date?: string; // DATETIME from assignments.due_date or exams.date
    course_name: string;
    course_color: string;
    type: 'assignment' | 'exam';
}

// Interface for Class Schedules (Recurring)
interface DbClassItem {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    course_name: string;
    course_color: string;
    course_start_date: string;
    course_end_date: string;
}

// Interface for Courses (All-day)
interface DbCourseItem {
    id: string;
    title: string; // Course name
    date: string;  // Start date
    course_name: string;
    course_color: string;
    type: 'course';
}
*/

/**
 * @description
 * API endpoint to fetch all calendar-related items for the authenticated user.
 * It queries assignments, exams, class schedules, and courses,
 * then formats them into a FullCalendar-compatible event array.
 */
export async function GET() {
    try {
        // --- NOTE: All data fetching is temporarily disabled as requested ---
        // --- To re-enable, uncomment the logic below ---

        /*
        const session = await requireAuth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const events = [];

        // --- Query 1: Get Assignments ---
        const assignments = await query<DbEventItem>(
            `SELECT 
                a.id, a.title, a.due_date as date, 
                c.name as course_name, c.color as course_color, 'assignment' as type
            FROM assignments a
            JOIN courses c ON a.course_id = c.id
            WHERE c.user_id = ?`,
            [session.userId]
        );

        // --- Query 2: Get Exams ---
        const exams = await query<DbEventItem>(
            `SELECT 
                e.id, e.title, e.date,
                c.name as course_name, c.color as course_color, 'exam' as type
            FROM exams e
            JOIN courses c ON e.course_id = c.id
            WHERE c.user_id = ?`,
            [session.userId]
        );

        // --- Query 3: Get Class Schedules (Recurring) ---
        const classSchedules = await query<DbClassItem>(
            `SELECT 
                cs.id, cs.day_of_week, cs.start_time, cs.end_time,
                c.name as course_name, c.color as course_color,
                c.start_date as course_start_date, 
                c.end_date as course_end_date
            FROM class_schedules cs
            JOIN courses c ON cs.course_id = c.id
            WHERE c.user_id = ?`,
            [session.userId]
        );

        // --- Query 4: Get Courses (All-day event on start date) ---
        const courses = await query<DbCourseItem>(
            `SELECT 
                id, name as title, start_date as date,
                name as course_name, color as course_color, 'course' as type
            FROM courses
            WHERE user_id = ? AND start_date IS NOT NULL`,
            [session.userId]
        );


        // --- Processing Loops (Disabled) ---

        // Format Assignments
        for (const item of assignments) {
            if (item.date) {
                events.push({
                    id: `assign-${item.id}`,
                    title: item.title,
                    date: new Date(item.date),
                    backgroundColor: item.course_color,
                    textColor: '#ffffff',
                    extendedProps: { type: item.type, courseName: item.course_name }
                });
            }
        }

        // Format Exams
        for (const item of exams) {
            if (item.date) {
                events.push({
                    id: `exam-${item.id}`,
                    title: item.title,
                    date: new Date(item.date),
                    backgroundColor: item.course_color,
                    textColor: '#ffffff',
                    extendedProps: { type: item.type, courseName: item.course_name }
                });
            }
        }

        // Format Class Schedules (Recurring)
        for (const item of classSchedules) {
            events.push({
                id: `class-${item.id}`,
                title: item.course_name,
                daysOfWeek: [item.day_of_week],
                startTime: item.start_time,
                endTime: item.end_time,
                startRecur: new Date(item.course_start_date),
                endRecur: new Date(item.course_end_date),
                backgroundColor: item.course_color,
                textColor: '#ffffff',
                extendedProps: { type: 'class', courseName: item.course_name }
            });
        }

        // Format Courses (All-day)
        for (const item of courses) {
            if (item.date) {
                events.push({
                    id: `course-${item.id}`,
                    title: `Bắt đầu: ${item.title}`,
                    date: item.date,
                    allDay: true,
                    backgroundColor: item.course_color,
                    textColor: '#ffffff',
                    extendedProps: {
                        type: item.type,
                        courseName: item.course_name
                    }
                });
            }
        }

        return NextResponse.json(events);
        */

        // --- End of disabled code ---

        // Return an empty array for the blank calendar view
        return NextResponse.json([]);

    } catch (error) {
        console.error('Error fetching calendar events:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Server error', details: errorMessage }, { status: 500 });
    }
}