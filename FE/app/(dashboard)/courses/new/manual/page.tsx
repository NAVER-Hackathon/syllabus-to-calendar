import { ManualEntryForm } from "@/components/course/ManualEntryForm";

export default function ManualEntryPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manual Course Entry</h1>
        <p className="text-gray-600">
          Enter your course information manually. All fields marked with * are required.
        </p>
      </div>
      <ManualEntryForm />
    </div>
  );
}

