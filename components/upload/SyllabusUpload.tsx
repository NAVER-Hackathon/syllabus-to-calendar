"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDropzone } from "./FileDropzone";
import { PDFPreview } from "./PDFPreview";
import { ImagePreview } from "./ImagePreview";
import { useSyllabusScanner } from "@/hooks/useSyllabusScanner";
import { PARSED_SYLLABUS_STORAGE_KEY } from "@/lib/storage-keys";

interface UploadStatus {
  status: "idle" | "uploading" | "processing" | "success" | "error";
  progress: number;
  message?: string;
  fileId?: string;
}

export function SyllabusUpload() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
    progress: 0,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const {
    status: scannerStatus,
    progress: scannerProgress,
    parsedData,
    error: scannerError,
    startScan,
    reset: resetScanner,
  } = useSyllabusScanner();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setUploadStatus({ status: "idle", progress: 0 });
    resetScanner();
    if (selectedFiles.length > 0) {
      setPreviewFile(selectedFiles[0]);
    } else {
      setPreviewFile(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus({ status: "uploading", progress: 10 });

    try {
      // Upload files
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const primaryFile = data.files?.[0];
      const storedFileId =
        primaryFile?.fileName || primaryFile?.id || data.fileId;
      const uploadId = primaryFile?.id || data.fileId;

      setUploadStatus({
        status: "processing",
        progress: 60,
        fileId: uploadId,
        message: "Starting AI parsing...",
      });

      if (!storedFileId) {
        throw new Error("Upload response missing file identifier");
      }

      await startScan({ fileId: storedFileId, uploadId });

      setUploadStatus((prev) => ({
        ...prev,
        status: "success",
        progress: 100,
        message: "Syllabus processed successfully!",
      }));
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (previewFile === files[index]) {
      setPreviewFile(newFiles[0] || null);
    }
  };

  const isPDF = (file: File) => file.type === "application/pdf";
  const isImage = (file: File) => file.type.startsWith("image/");

  useEffect(() => {
    if (scannerProgress.length === 0) return;
    const latest = scannerProgress[scannerProgress.length - 1];
    if (!latest?.message) return;
    setUploadStatus((prev) => {
      if (prev.status !== "processing") return prev;
      return {
        ...prev,
        message: latest.message,
      };
    });
  }, [scannerProgress]);

  useEffect(() => {
    if (!scannerError) return;
    setUploadStatus((prev) => ({
      ...prev,
      status: "error",
      progress: 0,
      message: scannerError,
    }));
  }, [scannerError]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Upload Syllabus</h2>
          <p className="text-gray-600">
            Upload PDF or image files of your course syllabus. We'll extract
            assignments, exams, and deadlines automatically.
          </p>
        </div>

        <FileDropzone
          onFilesSelected={handleFilesSelected}
          acceptedFiles={files}
          className="mb-6"
        />

      {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </p>
              <Button onClick={handleUpload} disabled={uploadStatus.status === "uploading" || uploadStatus.status === "processing"}>
                {uploadStatus.status === "uploading" || uploadStatus.status === "processing" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadStatus.status === "uploading" ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
            </div>

            {(uploadStatus.status === "uploading" ||
              uploadStatus.status === "processing") && (
              <Progress value={uploadStatus.progress} className="w-full" />
            )}

            {scannerProgress.length > 0 && (
              <div className="text-sm text-muted-foreground space-y-1">
                {scannerProgress.map((event, index) => (
                  <p key={`${event.timestamp}-${index}`}>
                    {event.message || `Step ${event.step ?? index + 1}`}
                  </p>
                ))}
              </div>
            )}

            {uploadStatus.status === "success" && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  {uploadStatus.message || "Syllabus processed successfully"}
                </AlertDescription>
              </Alert>
            )}

            {uploadStatus.status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>{uploadStatus.message || "An error occurred during processing"}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/courses/new/manual")}
                    className="mt-2"
                  >
                    Enter Course Manually
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </Card>

      {parsedData && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold">{parsedData.courseName || "Untitled Course"}</h3>
              <p className="text-sm text-muted-foreground">
                Review the extracted assignments and exams before continuing.
              </p>
            </div>
            <Button
              disabled={!uploadStatus.fileId || !parsedData}
              onClick={() => {
                if (!uploadStatus.fileId || !parsedData) return;
                try {
                  localStorage.setItem(
                    PARSED_SYLLABUS_STORAGE_KEY,
                    JSON.stringify({
                      uploadId: uploadStatus.fileId,
                      parsedData,
                      storedAt: Date.now(),
                    })
                  );
                } catch (error) {
                  console.warn("Failed to cache parsed syllabus", error);
                }
                router.push(
                  `/courses/new/create?uploadId=${uploadStatus.fileId}`
                );
              }}
            >
              Review In Course Builder
            </Button>
          </div>

          {parsedData.assignments && parsedData.assignments.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Assignments</p>
              <div className="space-y-2">
                {parsedData.assignments.map((assignment, index) => (
                  <div
                    key={`${assignment.title}-${index}`}
                    className="rounded border p-3 text-sm"
                  >
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-muted-foreground">
                      Due:{" "}
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleString()
                        : "TBD"}
                    </p>
                    {assignment.description && (
                      <p className="mt-1">{assignment.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedData.exams && parsedData.exams.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Exams</p>
              <div className="space-y-2">
                {parsedData.exams.map((exam, index) => (
                  <div key={`${exam.title}-${index}`} className="rounded border p-3 text-sm">
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-muted-foreground">
                      {exam.date ? new Date(exam.date).toLocaleString() : "Date TBD"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {previewFile && (
        <div>
          {isPDF(previewFile) ? (
            <PDFPreview
              file={previewFile}
              onRemove={() => {
                const index = files.indexOf(previewFile);
                handleRemoveFile(index);
              }}
            />
          ) : isImage(previewFile) ? (
            <ImagePreview
              file={previewFile}
              onRemove={() => {
                const index = files.indexOf(previewFile);
                handleRemoveFile(index);
              }}
            />
          ) : null}
        </div>
      )}

      {files.length > 1 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">All Files ({files.length})</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => setPreviewFile(file)}
              >
                <span className="text-sm truncate flex-1">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

