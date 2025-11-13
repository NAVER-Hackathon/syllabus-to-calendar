import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Course {
  id: string;
  name: string;
  code: string | null;
  term: string | null;
  instructor: string | null;
  start_date: Date;
  end_date: Date;
  color: string;
  created_at: Date;
}

export default async function CoursesPage() {
  const session = await requireAuth();

  const courses = await query<Course>(
    `SELECT id, name, code, term, instructor, start_date, end_date, color, created_at 
     FROM courses 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [session.userId]
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link href="/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-600 text-center py-8">
            No courses yet.{" "}
            <Link href="/courses/new" className="text-primary hover:underline">
              Upload your first syllabus
            </Link>
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: course.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{course.name}</h3>
                    {course.code && (
                      <p className="text-sm text-gray-500">{course.code}</p>
                    )}
                  </div>
                </div>
                {course.term && (
                  <p className="text-sm text-gray-600 mb-2">{course.term}</p>
                )}
                {course.instructor && (
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                )}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    {new Date(course.start_date).toLocaleDateString()} -{" "}
                    {new Date(course.end_date).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

