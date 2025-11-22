import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="p-4 border border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        {/* Icon skeleton */}
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
