export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  status: "uploaded" | "processing" | "failed";
}

export interface ParseResponse {
  success: boolean;
  parsedData?: any;
  error?: string;
}

