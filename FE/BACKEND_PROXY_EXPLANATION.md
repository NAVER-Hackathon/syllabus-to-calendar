# Backend Proxy Approach for NAVER AI Integration

## 📚 Table of Contents

1. [What is Backend Proxy?](#what-is-backend-proxy)
2. [Why Use Backend Proxy?](#why-use-backend-proxy)
3. [Architecture Comparison](#architecture-comparison)
4. [Complete Flow Diagram](#complete-flow-diagram)
5. [Step-by-Step Flow](#step-by-step-flow)
6. [Implementation Examples](#implementation-examples)
7. [Security Benefits](#security-benefits)
8. [When to Use Each Approach](#when-to-use-each-approach)

---

## What is Backend Proxy?

A **Backend Proxy** is an intermediate server layer that sits between your frontend application and external APIs (like NAVER CLOVA). Instead of calling external APIs directly from the frontend or Next.js API routes, you call your own backend service, which then calls the external APIs.

### Simple Analogy

Think of it like ordering food:
- **Direct Integration**: You call the restaurant directly (frontend → NAVER API)
- **Backend Proxy**: You call a delivery service, which calls the restaurant (frontend → Your Backend → NAVER API)

---

## Why Use Backend Proxy?

### 🔒 Security Benefits

1. **API Credentials Protection**
   - NAVER API keys stay on your backend server (never exposed to frontend)
   - Frontend never sees sensitive credentials
   - Reduces risk of credential theft or misuse

2. **Rate Limiting & Control**
   - Backend can implement rate limiting per user
   - Prevents API quota exhaustion
   - Can add caching to reduce API calls

3. **Error Handling & Retries**
   - Centralized error handling logic
   - Automatic retry mechanisms
   - Better error logging and monitoring

### 🚀 Performance Benefits

1. **Caching**
   - Cache OCR results for identical files
   - Reduce redundant API calls
   - Faster response times

2. **Request Optimization**
   - Batch multiple requests
   - Optimize payload sizes
   - Reduce network overhead

### 🛠️ Operational Benefits

1. **Centralized Management**
   - Update API integration in one place
   - Easier to switch API providers
   - Better monitoring and analytics

2. **Cost Control**
   - Track API usage per user
   - Implement usage quotas
   - Better cost management

---

## Architecture Comparison

### Option A: Direct Integration (Current)

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │ POST /api/parse-syllabus
       │
       ▼
┌─────────────────────┐
│   Next.js Server    │
│  (API Route)        │
│                     │
│  - requireAuth()    │
│  - Read file        │
│  - Call NAVER APIs  │ ← API Keys in .env.local
│  - Process data     │
└──────┬──────────────┘
       │
       │ HTTPS Request
       │ (with API keys)
       │
       ▼
┌─────────────────────┐
│   NAVER CLOVA APIs  │
│                     │
│  - CLOVA OCR        │
│  - CLOVA Studio     │
└─────────────────────┘
```

**Pros:**
- ✅ Simple architecture
- ✅ Fewer moving parts
- ✅ Faster development

**Cons:**
- ⚠️ API keys in Next.js environment
- ⚠️ Limited rate limiting options
- ⚠️ Harder to scale

---

### Option B: Backend Proxy (Recommended)

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │ POST /api/backend/parse-syllabus
       │
       ▼
┌─────────────────────┐
│   Next.js Server    │
│  (API Route)        │
│                     │
│  - requireAuth()    │
│  - Validate request │
│  - Forward to       │
│    backend          │
└──────┬──────────────┘
       │
       │ HTTP Request
       │ (with user context)
       │
       ▼
┌─────────────────────┐
│   Backend Server    │
│  (Your Service)     │
│                     │
│  - Validate user    │
│  - Rate limiting    │
│  - Call NAVER APIs  │ ← API Keys stored here
│  - Cache results    │
│  - Process data     │
└──────┬──────────────┘
       │
       │ HTTPS Request
       │ (with API keys)
       │
       ▼
┌─────────────────────┐
│   NAVER CLOVA APIs  │
│                     │
│  - CLOVA OCR        │
│  - CLOVA Studio     │
└─────────────────────┘
```

**Pros:**
- ✅ API keys secured on backend
- ✅ Better rate limiting
- ✅ Caching capabilities
- ✅ Easier to scale

**Cons:**
- ⚠️ More complex architecture
- ⚠️ Requires separate backend service
- ⚠️ Additional network hop

---

## Complete Flow Diagram

### Backend Proxy Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│              User uploads syllabus PDF/image                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  components/upload/SyllabusUpload.tsx                          │
│                                                                 │
│  1. User selects file                                           │
│  2. File validation                                            │
│  3. Show preview                                                │
│  4. User clicks "Upload & Process"                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ POST /api/upload
                             │ FormData: { files: [...] }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE #1                               │
│              app/api/upload/route.ts                            │
│                                                                 │
│  1. requireAuth() - Check authentication                        │
│  2. Validate file type & size                                  │
│  3. Save file to disk (uploads/)                                │
│  4. Save metadata to database (syllabus_uploads)                │
│  5. Return: { fileId, uploadId }                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Response: { fileId, uploadId }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  components/upload/SyllabusUpload.tsx                          │
│                                                                 │
│  1. Receive upload response                                     │
│  2. Show "Processing..." status                                │
│  3. Call parse API                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ POST /api/backend/parse-syllabus
                             │ JSON: { fileId, uploadId }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE #2                               │
│         app/api/backend/parse-syllabus/route.ts                │
│                                                                 │
│  1. requireAuth() - Check authentication                        │
│  2. Validate request                                           │
│  3. Read file from disk                                         │
│  4. Forward to backend service                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ POST https://your-backend.com/api/naver/parse-syllabus
                             │ Headers: { Authorization: Bearer <token> }
                             │ Body: { file: <base64 or multipart> }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND SERVICE (Your Server)                      │
│              (Node.js, Python, Java, etc.)                       │
│                                                                 │
│  1. Validate user token                                        │
│  2. Check rate limits                                           │
│  3. Check cache (if file processed before)                      │
│  4. If not cached:                                             │
│     a. Call CLOVA OCR API                                       │
│        POST https://ocr.apigw.ntruss.com/ocr/v1/document       │
│        Headers: { X-NCP-APIGW-API-KEY-ID: ... }                │
│        Body: { file: <base64> }                                 │
│     b. Receive OCR text                                         │
│     c. Call CLOVA Studio API                                    │
│        POST https://clovastudio.apigw.ntruss.com/...           │
│        Headers: { X-NCP-APIGW-API-KEY-ID: ... }                 │
│        Body: { text: <ocr_text>, prompt: <extraction_prompt> } │
│     d. Receive structured data                                 │
│     e. Parse and validate data                                  │
│     f. Cache result (optional)                                  │
│  5. Return parsed data                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Response: { success, data, confidence }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE #2                               │
│         app/api/backend/parse-syllabus/route.ts                │
│                                                                 │
│  1. Receive backend response                                    │
│  2. Update database (syllabus_uploads)                         │
│  3. Return to frontend                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Response: { success, parsedData, uploadId }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  components/upload/SyllabusUpload.tsx                          │
│                                                                 │
│  1. Receive parsed data                                        │
│  2. If success: Navigate to course creation form                │
│  3. If failed: Show error + manual entry option                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Flow

### Step 1: User Uploads File

**Frontend (`SyllabusUpload.tsx`):**
```typescript
const handleUpload = async () => {
  const formData = new FormData();
  formData.append("files", file);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  
  const data = await response.json();
  // data = { fileId: "abc123", uploadId: "uuid-456" }
};
```

**Next.js API (`/api/upload/route.ts`):**
```typescript
export async function POST(request: NextRequest) {
  const session = await requireAuth(); // ✅ Authentication
  
  const formData = await request.formData();
  const file = formData.get("files") as File;
  
  // Save file to disk
  const fileId = `${Date.now()}-${randomUUID()}.${ext}`;
  await writeFile(join(UPLOAD_DIR, fileId), buffer);
  
  // Save to database
  const uploadId = await saveUploadRecord({
    userId: session.userId,
    fileName: fileId,
    status: "uploaded",
  });
  
  return NextResponse.json({ fileId, uploadId });
}
```

---

### Step 2: Frontend Requests Parsing

**Frontend (`SyllabusUpload.tsx`):**
```typescript
const processResponse = await fetch("/api/backend/parse-syllabus", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    fileId: data.fileId,
    uploadId: data.uploadId 
  }),
});
```

---

### Step 3: Next.js API Forwards to Backend

**Next.js API (`/api/backend/parse-syllabus/route.ts`):**
```typescript
export async function POST(request: NextRequest) {
  const session = await requireAuth(); // ✅ Authentication
  
  const { fileId, uploadId } = await request.json();
  
  // Read file from disk
  const filePath = join(UPLOAD_DIR, fileId);
  const fileBuffer = await readFile(filePath);
  const base64File = fileBuffer.toString('base64');
  
  // Forward to backend service
  const backendResponse = await fetch(
    `${process.env.BACKEND_API_URL}/api/naver/parse-syllabus`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.userId}`, // User context
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64File,
        fileName: fileId,
        mimeType: "application/pdf", // or image/jpeg, etc.
      }),
    }
  );
  
  const parsedData = await backendResponse.json();
  
  // Update database
  await updateUploadRecord(uploadId, {
    status: parsedData.success ? "completed" : "failed",
    parsedData: parsedData.data,
  });
  
  return NextResponse.json(parsedData);
}
```

---

### Step 4: Backend Calls NAVER APIs

**Backend Service (Node.js example):**
```javascript
// POST /api/naver/parse-syllabus
app.post('/api/naver/parse-syllabus', async (req, res) => {
  // 1. Validate user
  const userId = validateToken(req.headers.authorization);
  
  // 2. Check rate limits
  if (await isRateLimited(userId)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }
  
  // 3. Check cache
  const cacheKey = hashFile(req.body.file);
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // 4. Call CLOVA OCR
  const ocrResponse = await fetch(
    'https://ocr.apigw.ntruss.com/ocr/v1/document',
    {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'V2',
        requestId: generateRequestId(),
        timestamp: Date.now(),
        images: [{
          format: 'pdf', // or jpg, png
          name: 'syllabus',
          data: req.body.file, // base64
        }],
      }),
    }
  );
  
  const ocrData = await ocrResponse.json();
  const extractedText = ocrData.images[0].inferText;
  
  // 5. Call CLOVA Studio
  const studioResponse = await fetch(
    'https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002',
    {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Extract course information from this syllabus...',
          },
          {
            role: 'user',
            content: extractedText,
          },
        ],
        maxTokens: 2000,
        temperature: 0.1,
      }),
    }
  );
  
  const studioData = await studioResponse.json();
  const structuredData = JSON.parse(studioData.message.content);
  
  // 6. Cache result
  await saveToCache(cacheKey, structuredData);
  
  // 7. Return parsed data
  res.json({
    success: true,
    data: structuredData,
    confidence: 0.85,
  });
});
```

---

### Step 5: Response Flows Back

**Backend → Next.js → Frontend:**
```typescript
// Backend returns
{
  success: true,
  data: {
    courseName: "Introduction to Computer Science",
    courseCode: "CS101",
    assignments: [...],
    exams: [...],
    classSchedule: [...],
  },
  confidence: 0.85
}

// Next.js forwards to frontend (same structure)

// Frontend receives and navigates to course creation
if (processData.success) {
  router.push(`/courses/new/create?uploadId=${uploadId}`);
}
```

---

## Implementation Examples

### Example 1: Next.js API Route (Backend Proxy)

```typescript
// app/api/backend/parse-syllabus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { readFile } from "fs/promises";
import { join } from "path";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await requireAuth();
    
    // 2. Parse request
    const { fileId, uploadId } = await request.json();
    
    // 3. Read file
    const filePath = join(process.cwd(), "uploads", fileId);
    const fileBuffer = await readFile(filePath);
    const base64File = fileBuffer.toString("base64");
    
    // 4. Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/naver/parse-syllabus`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.userId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64File,
        fileName: fileId,
        uploadId, // For tracking
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 5. Update database
    if (uploadId) {
      await updateUploadStatus(uploadId, data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### Example 2: Backend Service (Node.js/Express)

```javascript
// backend/routes/naver.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Rate limiting: 10 requests per minute per user
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.userId,
});

router.post('/parse-syllabus', limiter, async (req, res) => {
  try {
    const { file, fileName } = req.body;
    const userId = req.userId; // From auth middleware
    
    // Check cache
    const fileHash = hashFile(file);
    const cached = cache.get(fileHash);
    if (cached) {
      return res.json(cached);
    }
    
    // Step 1: CLOVA OCR
    const ocrText = await callClovaOCR(file);
    
    // Step 2: CLOVA Studio
    const structuredData = await callClovaStudio(ocrText);
    
    // Step 3: Cache result
    cache.set(fileHash, {
      success: true,
      data: structuredData,
      confidence: 0.85,
    });
    
    res.json({
      success: true,
      data: structuredData,
      confidence: 0.85,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

async function callClovaOCR(fileBase64) {
  const response = await fetch(
    'https://ocr.apigw.ntruss.com/ocr/v1/document',
    {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'V2',
        requestId: generateRequestId(),
        timestamp: Date.now(),
        images: [{
          format: 'pdf',
          name: 'syllabus',
          data: fileBase64,
        }],
      }),
    }
  );
  
  const data = await response.json();
  return data.images[0].inferText;
}

async function callClovaStudio(text) {
  const prompt = `Extract the following information from this syllabus:
  - Course name
  - Course code
  - Term
  - Instructor
  - Start date
  - End date
  - Assignments (title, due date, description)
  - Exams (title, date, time, location)
  - Class schedule (day of week, start time, end time, location)
  
  Return as JSON.`;
  
  const response = await fetch(
    'https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002',
    {
      method: 'POST',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: text },
        ],
        maxTokens: 2000,
        temperature: 0.1,
      }),
    }
  );
  
  const data = await response.json();
  return JSON.parse(data.message.content);
}

module.exports = router;
```

---

## Security Benefits

### 1. Credential Protection

**Direct Integration (Risky):**
```env
# .env.local (exposed in Next.js)
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-secret
```
- ⚠️ Credentials in frontend codebase
- ⚠️ Risk of exposure in client bundles
- ⚠️ Harder to rotate credentials

**Backend Proxy (Secure):**
```env
# Backend .env (never exposed)
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-secret
```
- ✅ Credentials only on backend server
- ✅ Never sent to frontend
- ✅ Easy credential rotation

---

### 2. Rate Limiting

**Backend can implement:**
- Per-user rate limits
- Per-IP rate limits
- Global rate limits
- Quota management

```javascript
// Backend rate limiting
const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 requests per minute per user
  keyGenerator: (req) => req.userId,
});
```

---

### 3. Request Validation

**Backend can validate:**
- User permissions
- File size limits
- Request frequency
- Data format

```javascript
// Backend validation
if (fileSize > MAX_FILE_SIZE) {
  return res.status(400).json({ error: "File too large" });
}

if (await getUserQuota(userId) <= 0) {
  return res.status(429).json({ error: "Quota exceeded" });
}
```

---

## When to Use Each Approach

### Use Direct Integration When:
- ✅ Prototyping/MVP
- ✅ Small team/simple project
- ✅ Low security requirements
- ✅ Limited budget (no separate backend)
- ✅ Fast development needed

### Use Backend Proxy When:
- ✅ Production application
- ✅ Security is critical
- ✅ Need rate limiting
- ✅ Need caching
- ✅ Multiple clients (web, mobile)
- ✅ Need usage tracking
- ✅ Enterprise application

---

## Summary

**Backend Proxy Flow:**
1. Frontend → Next.js API (with auth)
2. Next.js API → Backend Service (with user context)
3. Backend Service → NAVER APIs (with credentials)
4. NAVER APIs → Backend Service (parsed data)
5. Backend Service → Next.js API (forwarded)
6. Next.js API → Frontend (display results)

**Key Benefits:**
- 🔒 Secure credential storage
- 🚀 Better performance (caching)
- 🛡️ Rate limiting & quotas
- 📊 Usage tracking
- 🔄 Easier to maintain

**Next Steps:**
1. Set up backend service (Node.js, Python, etc.)
2. Create `/api/backend/parse-syllabus` route in Next.js
3. Implement NAVER API calls in backend
4. Add caching and rate limiting
5. Test end-to-end flow

