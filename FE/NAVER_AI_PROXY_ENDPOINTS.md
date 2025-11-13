# NAVER AI Proxy Endpoints Configuration

## Overview

This document explains how the Next.js proxy (`proxy.ts`) handles NAVER AI integration endpoints and the recommended architecture.

---

## Current Proxy Configuration

The `proxy.ts` file **excludes all `/api` routes** from authentication checks:

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

This means:
- ✅ All `/api/*` routes bypass the proxy authentication
- ✅ Individual API routes must handle their own authentication using `requireAuth()`
- ✅ This allows API routes to return JSON errors instead of redirecting to login

---

## NAVER AI Integration Approaches

### Option 1: Direct Integration (Next.js API Routes) ⭐ Current Approach

**Architecture:**
```
Frontend → Next.js API Route → NAVER CLOVA APIs
```

**Endpoints:**
- `POST /api/parse-syllabus` - Main parsing endpoint (requires auth)
- `POST /api/upload` - File upload (requires auth)

**Authentication:**
- Each API route uses `requireAuth()` internally
- Returns `401 Unauthorized` JSON response if not authenticated
- No redirects (better for API calls)

**Example:**
```typescript
// app/api/parse-syllabus/route.ts
export async function POST(request: NextRequest) {
  const session = await requireAuth(); // ✅ Protected
  
  // Call NAVER CLOVA OCR
  // Call NAVER CLOVA Studio
  // Return parsed data
}
```

**Pros:**
- ✅ Simple architecture
- ✅ All logic in one place
- ✅ No additional backend needed

**Cons:**
- ⚠️ API credentials stored in Next.js environment variables
- ⚠️ NAVER API calls count against Next.js server resources

---

### Option 2: Backend Proxy Endpoints

**Architecture:**
```
Frontend → Next.js API Route → Backend Proxy → NAVER CLOVA APIs
```

**Endpoints:**
- `POST /api/backend/ocr` - OCR text extraction (requires auth)
- `POST /api/backend/parse` - Structured data extraction (requires auth)
- `POST /api/backend/parse-syllabus` - Combined endpoint (requires auth)

**Authentication:**
- Next.js API routes use `requireAuth()` to protect access
- Backend proxy handles NAVER API credentials securely

**Example:**
```typescript
// app/api/backend/parse-syllabus/route.ts
export async function POST(request: NextRequest) {
  const session = await requireAuth(); // ✅ Protected
  
  // Forward request to backend proxy
  const response = await fetch('https://your-backend.com/api/naver/parse-syllabus', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.userId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId, uploadId }),
  });
  
  return NextResponse.json(await response.json());
}
```

**Pros:**
- ✅ API credentials stored securely on backend
- ✅ Can add caching, rate limiting, etc.
- ✅ Separates concerns

**Cons:**
- ⚠️ Requires separate backend service
- ⚠️ More complex architecture

---

## Recommended Endpoint Structure

### If Using Direct Integration (Current)

```
POST /api/parse-syllabus
├── Authentication: requireAuth() ✅
├── Input: { fileId, uploadId }
├── Process:
│   ├── 1. Call CLOVA OCR API
│   ├── 2. Call CLOVA Studio API
│   └── 3. Parse and structure data
└── Output: { success, parsedData, confidence }
```

### If Using Backend Proxy

```
POST /api/backend/parse-syllabus
├── Authentication: requireAuth() ✅
├── Input: { fileId, uploadId }
├── Forward to: Backend → NAVER APIs
└── Output: { success, parsedData, confidence }
```

---

## Proxy.ts Configuration

**No changes needed** to `proxy.ts` for NAVER AI integration because:

1. ✅ All `/api` routes are already excluded from proxy checks
2. ✅ Individual API routes handle authentication with `requireAuth()`
3. ✅ This allows proper JSON error responses for API calls

**Current behavior:**
- `/api/*` routes → Bypass proxy, handle auth internally
- `/courses/*` routes → Protected by proxy (redirects to login)
- `/login`, `/register` → Public routes

---

## Security Considerations

### API Route Protection

All NAVER AI-related API routes **must** use `requireAuth()`:

```typescript
import { requireAuth } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(); // ✅ Required
    
    // Only authenticated users can access
    // session.userId available for user-specific operations
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
```

### Environment Variables

**If using Direct Integration:**
```env
# Store in .env.local (never commit)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
CLOVA_OCR_API_URL=https://ocr.apigw.ntruss.com/ocr/v1/document
CLOVA_STUDIO_API_URL=https://clovastudio.apigw.ntruss.com/...
CLOVA_STUDIO_API_KEY=...
```

**If using Backend Proxy:**
```env
# Backend URL (credentials stored on backend)
BACKEND_API_URL=https://your-backend.com
BACKEND_API_KEY=... # Optional, for backend authentication
```

---

## Implementation Checklist

### For Direct Integration:
- [x] Add `requireAuth()` to `/api/parse-syllabus`
- [ ] Add NAVER API credentials to `.env.local`
- [ ] Implement CLOVA OCR API call
- [ ] Implement CLOVA Studio API call
- [ ] Add error handling and retries
- [ ] Add rate limiting (if needed)

### For Backend Proxy:
- [ ] Create `/api/backend/parse-syllabus` route
- [ ] Add `requireAuth()` to backend proxy routes
- [ ] Implement backend communication
- [ ] Add error handling
- [ ] Update frontend to use new endpoints

---

## Summary

**Proxy.ts behavior:**
- ✅ Excludes `/api` routes (no changes needed)
- ✅ API routes handle their own authentication
- ✅ Returns JSON errors instead of redirects

**NAVER AI endpoints:**
- ✅ Must use `requireAuth()` in each API route
- ✅ Can use direct integration or backend proxy
- ✅ Credentials stored securely (env vars or backend)

**Current status:**
- ✅ `/api/parse-syllabus` now has authentication
- ⏳ Ready for NAVER AI integration implementation

