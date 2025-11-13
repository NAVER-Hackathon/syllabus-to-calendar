# NAVER AI Integration Requirements

## What to Ask Your Backend Teammates

This document outlines what you need from your backend team to integrate NAVER CLOVA OCR and CLOVA Studio APIs.

---

## 🔑 1. API Credentials & Access

### CLOVA OCR

- [ ] **API Endpoint URL**

  - Example: `https://ocr.apigw.ntruss.com/ocr/v1/document`
  - Is this the correct endpoint for document OCR?

- [ ] **Authentication Method**

  - API Key?
  - Client ID + Client Secret?
  - OAuth token?
  - What headers are required?

- [ ] **Credentials**
  - Client ID: `_________________`
  - Client Secret: `_________________`
  - API Key (if different): `_________________`

### CLOVA Studio

- [ ] **API Endpoint URL**

  - Example: `https://clovastudio.apigw.ntruss.com/...`
  - What's the exact endpoint for document understanding/parsing?

- [ ] **Authentication Method**

  - Same as CLOVA OCR?
  - Different credentials?

- [ ] **Credentials**
  - Client ID: `_________________`
  - Client Secret: `_________________`
  - API Key: `_________________`

---

## 📋 2. API Documentation & Specifications

### Request Format

- [ ] **CLOVA OCR Request Format**

  - How to send files? (multipart/form-data, base64, URL?)
  - What file formats are supported? (PDF, JPEG, PNG - confirmed)
  - Maximum file size?
  - Request body structure/example

- [ ] **CLOVA Studio Request Format**
  - How to send extracted text?
  - What prompt/structure for structured data extraction?
  - Request body structure/example

### Response Format

- [ ] **CLOVA OCR Response**

  - What does the response look like?
  - Is it plain text or structured?
  - Example response JSON

- [ ] **CLOVA Studio Response**
  - What format is the extracted data in?
  - Example response JSON
  - How are dates/assignments structured?

---

## 🔄 3. Integration Flow

### Current Understanding

1. Upload file → CLOVA OCR (extract text)
2. Send text → CLOVA Studio (extract structured data)
3. Parse response → Create course/assignments

### Questions for Backend Team

- [ ] **Is this flow correct?**
- [ ] **Can we call CLOVA Studio directly with the file?** (skip OCR step?)
- [ ] **Should we use a different approach?**
- [ ] **Any preprocessing needed before calling APIs?**

---

## 📊 4. Data Extraction Requirements

### What We Need to Extract

- ✅ Assignment names and due dates
- ✅ Exam dates
- ✅ Class schedule (meeting times)
- ✅ Project deadlines

### Questions

- [ ] **Can CLOVA Studio extract all of this in one call?**
- [ ] **Do we need multiple API calls?**
- [ ] **What's the best prompt/structure for extraction?**
- [ ] **Any specific format requirements for the prompt?**

---

## ⚙️ 5. Technical Details

### Rate Limits & Quotas

- [ ] **Rate limits per minute/hour/day?**
- [ ] **Free tier limits?**
- [ ] **What happens when limit is exceeded?**
- [ ] **Do we need to implement rate limiting?**

### Error Handling

- [ ] **What error codes/responses should we handle?**
- [ ] **Common error scenarios?**
- [ ] **Retry logic needed?**

### Performance

- [ ] **Expected processing time?**
- [ ] **File size limits?**
- [ ] **Timeout settings?**

---

## 🛠️ 6. Implementation Approach

### Option A: Direct API Integration (Frontend → NAVER)

- Frontend calls NAVER APIs directly
- Requires API keys in frontend (security concern)

### Option B: Backend Proxy (Frontend → Backend → NAVER) ⭐ Recommended

- Frontend calls your backend API
- Backend calls NAVER APIs
- Keeps credentials secure
- Can add caching, rate limiting, etc.

### Questions

- [ ] **Which approach should we use?**
- [ ] **If Option B, what endpoints should backend provide?**
  - `POST /api/backend/ocr` - Send file, get text
  - `POST /api/backend/parse` - Send text, get structured data
  - Or combined: `POST /api/backend/parse-syllabus` - Send file, get everything

---

## 📝 7. Backend API Specification (If Using Proxy)

If backend team creates proxy endpoints, we need:

### Endpoint 1: OCR/Text Extraction

```
POST /api/backend/ocr
Content-Type: multipart/form-data

Request:
- file: File (PDF or image)

Response:
{
  "success": true,
  "text": "extracted text content...",
  "confidence": 0.95
}
```

### Endpoint 2: Structured Data Extraction

```
POST /api/backend/parse
Content-Type: application/json

Request:
{
  "text": "extracted text from OCR",
  "extractionType": "syllabus" // or specific prompt
}

Response:
{
  "success": true,
  "data": {
    "courseName": "...",
    "assignments": [...],
    "exams": [...],
    "classSchedule": [...]
  },
  "confidence": 0.85
}
```

### Combined Endpoint (Preferred)

```
POST /api/backend/parse-syllabus
Content-Type: multipart/form-data

Request:
- file: File (PDF or image)

Response:
{
  "success": true,
  "data": {
    "courseName": "...",
    "courseCode": "...",
    "term": "...",
    "instructor": "...",
    "startDate": "...",
    "endDate": "...",
    "assignments": [
      {
        "title": "...",
        "dueDate": "...",
        "description": "..."
      }
    ],
    "exams": [
      {
        "title": "...",
        "date": "...",
        "time": "...",
        "location": "..."
      }
    ],
    "classSchedule": [
      {
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "10:30",
        "location": "..."
      }
    ]
  },
  "confidence": 0.85
}
```

---

## 🔐 8. Security & Environment Variables

### What We Need

- [ ] **Where to store API credentials?**

  - Environment variables?
  - Backend only (if using proxy)?

- [ ] **Environment variable names:**
  ```env
  NAVER_CLIENT_ID=...
  NAVER_CLIENT_SECRET=...
  CLOVA_OCR_API_URL=...
  CLOVA_STUDIO_API_URL=...
  CLOVA_STUDIO_API_KEY=...
  ```

---

## 📚 9. Documentation & Resources

- [ ] **NAVER Cloud Platform documentation links**
- [ ] **API reference documentation**
- [ ] **Code examples or sample implementations**
- [ ] **SDK/library recommendations (if any)**

---

## 🧪 10. Testing

- [ ] **Test API credentials provided?**
- [ ] **Sample files for testing?**
- [ ] **Expected test responses?**
- [ ] **Test environment vs production?**

---

## ✅ Quick Checklist for Backend Team

**Minimum Required:**

1. ✅ API endpoint URLs (CLOVA OCR + Studio)
2. ✅ Authentication credentials (Client ID, Secret, API Key)
3. ✅ Request/response format examples
4. ✅ Rate limits and quotas
5. ✅ Decision: Direct API or backend proxy?

**Nice to Have:**

- Documentation links
- Code examples
- Test credentials
- Sample responses

---

## 📧 Email Template

You can use this template to ask your backend teammates:

```
Subject: NAVER AI Integration - Information Needed

Hi [Backend Team],

I'm working on integrating NAVER CLOVA OCR and CLOVA Studio for the syllabus
parsing feature. I need the following information:

1. API Credentials:
   - CLOVA OCR endpoint and authentication details
   - CLOVA Studio endpoint and authentication details
   - Client ID, Client Secret, API Keys

2. API Specifications:
   - Request/response formats
   - File upload method
   - Rate limits

3. Integration Approach:
   - Should we call NAVER APIs directly from frontend?
   - Or should backend create proxy endpoints? (Recommended for security)

4. Documentation:
   - Any NAVER Cloud Platform docs or examples?

Please see the attached requirements document for full details.

Thanks!
```

---

## 🎯 Current Implementation Status

**What's Ready:**

- ✅ File upload system
- ✅ Database schema for storing parsed data
- ✅ API route structure (`/api/parse-syllabus`)
- ✅ Mock implementation (ready to replace)

**What's Needed:**

- ⏳ NAVER API credentials
- ⏳ API endpoint URLs
- ⏳ Request/response format
- ⏳ Integration approach decision

---

## 📝 Notes

- The current implementation has a placeholder in `/app/api/parse-syllabus/route.ts`
- Once we have the API details, we can replace the mock implementation
- Consider error handling, retries, and user feedback during processing
