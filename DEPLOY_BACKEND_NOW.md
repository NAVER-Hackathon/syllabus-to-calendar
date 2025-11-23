# Deploy Backend to Vercel - REQUIRED

## Why You're Getting 500/404 Errors

Your frontend is trying to call a **backend service** for AI syllabus parsing, but the backend isn't deployed yet!

The backend handles:

- 📷 NAVER Clova OCR (extract text from images)
- 🤖 Clova Studio AI (parse syllabus data)

---

## Quick Deploy: Backend to Vercel

### Step 1: Check if You Have NAVER Clova API Keys

The backend needs these environment variables:

- `SECRET_KEY_OCR` - NAVER Clova OCR API key
- `CLOVA_OCR_URL` - NAVER Clova OCR endpoint
- `CLOVA_STUDIO_API_KEY` - NAVER Clova Studio API key
- `CLOVA_STUDIO_URL` - NAVER Clova Studio endpoint

**Do you have these keys?**

- ✅ **YES** → Continue to Step 2
- ❌ **NO** → You need to get them from NAVER Cloud Console first

---

### Step 2: Deploy Backend via Vercel Dashboard

1. **Go to Vercel:**
   https://vercel.com/new

2. **Import the SAME repository:**

   - Select: `NAVER-Hackathon/syllabus-to-calendar`

3. **Configure Project:**

   - **Project Name**: `syllabus-to-calendar-backend` (or similar)
   - **Root Directory**: `BE` ⚠️ **IMPORTANT**
   - **Framework Preset**: Other (or Node.js)
   - **Build Command**: (leave empty or `npm install`)
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   SECRET_KEY_OCR=your-naver-clova-ocr-key
   CLOVA_OCR_URL=your-naver-clova-ocr-url
   CLOVA_STUDIO_API_KEY=your-naver-clova-studio-key
   CLOVA_STUDIO_URL=your-naver-clova-studio-url
   ```

5. **Click "Deploy"** and wait 1-2 minutes

6. **Copy the deployed URL** (e.g., `https://syllabus-to-calendar-backend.vercel.app`)

---

### Step 3: Update Frontend BACKEND_API_URL

1. **Go to your frontend project settings:**
   https://vercel.com/van-trans-projects-5c55ea5c/syllabus-to-calendar/settings/environment-variables

2. **Add or update `BACKEND_API_URL`:**

   ```
   BACKEND_API_URL=https://your-backend-url.vercel.app
   ```

   (Use the URL from Step 2)

3. **Select all environments:**

   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Click "Save"**

5. **Redeploy the frontend** (same steps as before)

---

## Alternative: Don't Have NAVER Clova Keys?

If you don't have the NAVER Clova API keys, you have a few options:

### Option A: Get NAVER Clova Keys

1. Go to NAVER Cloud Console
2. Sign up / Login
3. Enable Clova OCR and Clova Studio services
4. Get API keys and endpoints

### Option B: Use a Different OCR/AI Service

You'd need to modify the backend code to use:

- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision
- OpenAI API for parsing

### Option C: Skip Syllabus Parsing for Now

Test other features that don't require backend:

- Manual course creation
- Task management
- Calendar view

---

## Quick Check: Do You Need the Backend?

**Backend is required if you want to:**

- ✅ Upload syllabus images/PDFs
- ✅ Auto-extract text from syllabi
- ✅ AI-parse syllabus into structured data

**Backend is NOT needed if you:**

- ❌ Manually create courses (no upload)
- ❌ Only test database/auth features
- ❌ Only use frontend UI

---

## After Backend is Deployed

1. **Verify backend is working:**
   Visit: `https://your-backend-url.vercel.app`
   Should see a basic HTML page

2. **Test the parse endpoint:**
   Try uploading a syllabus again in your frontend

   - 500/404 errors should be gone
   - Should see "Processing..." or success message

3. **Check logs if issues persist:**
   ```bash
   vercel logs https://your-backend-url.vercel.app --since 5m
   ```

---

## Summary

**You need to:**

1. ✅ Deploy backend separately to Vercel (root directory: `BE`)
2. ✅ Add NAVER Clova environment variables to backend
3. ✅ Add `BACKEND_API_URL` to frontend environment variables
4. ✅ Redeploy frontend

**Without the backend, syllabus upload/parsing won't work!**
