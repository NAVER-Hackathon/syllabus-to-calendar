import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4 border border-gray-200 bg-white">
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            
            {/* Action button skeleton */}
            <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
}
