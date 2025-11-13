# Backend Service for NAVER AI Integration

This is a Node.js/Express backend service that handles NAVER CLOVA OCR and CLOVA Studio API calls.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your NAVER API credentials
   ```

3. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following:

```env
PORT=3001
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-client-secret
CLOVA_OCR_API_URL=https://ocr.apigw.ntruss.com/ocr/v1/document
CLOVA_STUDIO_API_URL=https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002
```

## API Endpoints

### POST /api/naver/parse-syllabus

Parse a syllabus file using NAVER CLOVA OCR and CLOVA Studio.

**Request:**
```json
{
  "file": "base64-encoded-file",
  "fileName": "syllabus.pdf",
  "mimeType": "application/pdf",
  "uploadId": "optional-upload-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courseName": "Introduction to Computer Science",
    "courseCode": "CS101",
    "term": "Fall 2025",
    "instructor": "Dr. Smith",
    "startDate": "2025-09-01T00:00:00.000Z",
    "endDate": "2025-12-15T00:00:00.000Z",
    "assignments": [...],
    "exams": [...],
    "classSchedule": [...]
  }
}
```

**Headers:**
- `Authorization: Bearer <user-id>` (required)

**Rate Limiting:**
- 10 requests per minute per user

**Caching:**
- Results are cached for 1 hour based on file content hash

## Features

- ✅ CLOVA OCR integration for text extraction
- ✅ CLOVA Studio integration for structured data extraction
- ✅ Rate limiting (10 requests/minute per user)
- ✅ Response caching (1 hour TTL)
- ✅ Error handling and logging
- ✅ Health check endpoint

## Next.js Integration

In your Next.js `.env.local`, add:

```env
BACKEND_API_URL=http://localhost:3001
```

Then your Next.js app will automatically forward parsing requests to this backend service.

