# Quick Start: NAVER AI Integration

## 🚀 Quick Setup (5 Minutes)

### 1. Set Up Backend Service

```bash
# Navigate to backend service directory
cd backend-service-example

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your NAVER credentials:
# NAVER_CLIENT_ID=your-actual-id
# NAVER_CLIENT_SECRET=your-actual-secret

# Start backend service
npm start
```

### 2. Configure Next.js

Add to `.env.local`:
```env
BACKEND_API_URL=http://localhost:3001
```

### 3. Test It!

1. Start Next.js: `npm run dev`
2. Upload a syllabus file
3. Check backend logs for API calls
4. See parsed data in course form

---

## 📁 Files Created

### Next.js API Routes
- ✅ `app/api/backend/parse-syllabus/route.ts` - Backend proxy route
- ✅ `app/api/parse-syllabus/route.ts` - Updated to use backend proxy

### Backend Service
- ✅ `backend-service-example/server.js` - Complete backend service
- ✅ `backend-service-example/package.json` - Dependencies
- ✅ `backend-service-example/.env.example` - Environment template
- ✅ `backend-service-example/README.md` - Backend docs

### Documentation
- ✅ `NAVER_AI_IMPLEMENTATION_GUIDE.md` - Complete guide
- ✅ `BACKEND_PROXY_EXPLANATION.md` - Architecture explanation

---

## 🔄 How It Works

```
1. User uploads file → Next.js saves it
2. Frontend calls /api/parse-syllabus
3. Next.js forwards to /api/backend/parse-syllabus
4. Backend service calls CLOVA OCR → extracts text
5. Backend service calls CLOVA Studio → extracts structured data
6. Data flows back to frontend
7. User sees course creation form with parsed data
```

---

## ⚙️ Configuration

### Environment Variables

**Backend Service (.env):**
```env
PORT=3001
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-client-secret
CLOVA_OCR_API_URL=https://ocr.apigw.ntruss.com/ocr/v1/document
CLOVA_STUDIO_API_URL=https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002
```

**Next.js (.env.local):**
```env
BACKEND_API_URL=http://localhost:3001
```

---

## 🧪 Testing

### Test Backend Service
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok",...}
```

### Test Full Flow
1. Upload PDF/image syllabus
2. Check backend logs for:
   - "Calling CLOVA OCR..."
   - "OCR extracted X characters"
   - "Calling CLOVA Studio..."
   - "Cached result..."

---

## 🐛 Troubleshooting

**Backend not responding?**
- Check if running: `curl http://localhost:3001/health`
- Check `BACKEND_API_URL` in `.env.local`

**NAVER API errors?**
- Verify credentials in backend `.env`
- Check API endpoint URLs
- Review backend service logs

**No parsed data?**
- Check backend service logs
- Verify file format (PDF, JPEG, PNG)
- Check database `syllabus_uploads` table

---

## 📚 Full Documentation

- **Complete Guide:** `NAVER_AI_IMPLEMENTATION_GUIDE.md`
- **Architecture:** `BACKEND_PROXY_EXPLANATION.md`
- **Requirements:** `NAVER_AI_INTEGRATION_REQUIREMENTS.md`

---

## ✅ You're Ready!

The integration is complete. Just:
1. Add your NAVER API credentials
2. Start the backend service
3. Start Next.js
4. Upload and parse syllabi!

🎉 Happy coding!

