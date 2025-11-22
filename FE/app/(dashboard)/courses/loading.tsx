import { CourseCardSkeleton } from "@/components/course/CourseCardSkeleton";

export default function Loading() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse ml-4" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
