export interface SyllabusUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  status: "uploading" | "processing" | "completed" | "failed";
  courseId?: string;
}

export interface ParsedSyllabus {
  courseName?: string;
  courseCode?: string;
  term?: string;
  instructor?: string;
  startDate?: Date;
  endDate?: Date;
  assignments: ParsedAssignment[];
  exams: ParsedExam[];
  classSchedule?: ParsedClassSchedule[];
  rawText?: string;
  confidence?: number;
}

export interface ParsedAssignment {
  title: string;
  dueDate?: Date;
  description?: string;
}

export interface ParsedExam {
  title: string;
  date?: Date;
  time?: string;
  location?: string;
}

export interface ParsedClassSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location?: string;
}

