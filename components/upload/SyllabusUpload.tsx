"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDropzone } from "./FileDropzone";
import { PDFPreview } from "./PDFPreview";
import { ImagePreview } from "./ImagePreview";

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
  const [parsedData, setParsedData] = useState<any>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setUploadStatus({ status: "idle", progress: 0 });
    // Auto-select first file for preview
    if (selectedFiles.length > 0 && !previewFile) {
      setPreviewFile(selectedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus({ status: "uploading", progress: 0 });

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
      
      setUploadStatus({
        status: "processing",
        progress: 50,
        fileId: data.fileId,
      });

      // Start processing with NAVER AI
      // Pass both fileId (filename) and uploadId (database ID)
      const processResponse = await fetch("/api/parse-syllabus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fileId: data.files[0]?.fileName || data.fileId,
          uploadId: data.fileId // This is the database ID
        }),
      });

      if (!processResponse.ok) {
        throw new Error("Processing failed");
      }

      const processData = await processResponse.json();

      if (processData.success) {
        setUploadStatus({
          status: "success",
          progress: 100,
          message: "Syllabus processed successfully!",
        });
        setParsedData(processData.parsedData);
        
        // Navigate to course creation page with parsed data
        setTimeout(() => {
          router.push(`/courses/new/create?uploadId=${data.fileId}`);
        }, 1500);
      } else {
        setUploadStatus({
          status: "error",
          progress: 0,
          message: processData.error || "Failed to process syllabus",
        });
      }
    } catch (error) {
      setUploadStatus({
        status: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "An error occurred",
      });
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

