"use client";

import { useSearchParams } from "next/navigation";
import { CourseCreationForm } from "@/components/course/CourseCreationForm";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function CreateCourseContent() {
  const searchParams = useSearchParams();
  const uploadId = searchParams.get("uploadId");
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uploadId) {
      // Fetch parsed data from upload
      setLoading(true);
      fetch(`/api/upload?uploadId=${uploadId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.parsedData) {
            setParsedData(data.parsedData);
          } else if (data.upload?.parsed_data) {
            // Parse JSON string if stored as string
            try {
              setParsedData(
                typeof data.upload.parsed_data === "string"
                  ? JSON.parse(data.upload.parsed_data)
                  : data.upload.parsed_data
              );
            } catch (e) {
              console.error("Failed to parse parsed_data:", e);
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [uploadId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Course</h1>
        <p className="text-gray-600">
          {parsedData
            ? "Review and edit the extracted course information."
            : "Enter your course information."}
        </p>
      </div>
      <CourseCreationForm parsedData={parsedData} uploadId={uploadId || undefined} />
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    }>
      <CreateCourseContent />
    </Suspense>
  );
}

