# NAVER AI Integration Implementation Guide

## Complete Step-by-Step Guide for Backend Proxy Approach

This guide shows you how to implement NAVER AI integration using the backend proxy approach.

---

## 📋 Prerequisites

1. **NAVER Cloud Platform Account**

   - Sign up at: https://www.ncloud.com/
   - Get API credentials (Client ID, Client Secret)

2. **Node.js Installed**

   - Version 18+ recommended

3. **Your Next.js App Running**
   - Already set up with upload functionality

---

## 🚀 Step 1: Set Up Backend Service

### 1.1 Create Backend Service Directory

```bash
cd /path/to/your/project
mkdir backend-service
cd backend-service
```

### 1.2 Initialize Node.js Project

```bash
npm init -y
```

### 1.3 Install Dependencies

```bash
npm install express cors dotenv node-cache express-rate-limit
npm install --save-dev nodemon
```

### 1.4 Copy Backend Service Files

Copy the files from `backend-service-example/` directory:

- `server.js` - Main backend service
- `.env.example` - Environment variables template
- `package.json` - Dependencies
- `README.md` - Documentation

### 1.5 Configure Environment Variables

Create `.env` file:

```env
PORT=3001
NAVER_CLIENT_ID=your-actual-client-id
NAVER_CLIENT_SECRET=your-actual-client-secret
CLOVA_OCR_API_URL=https://ocr.apigw.ntruss.com/ocr/v1/document
CLOVA_STUDIO_API_URL=https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002
```

**⚠️ Important:** Replace with your actual NAVER API credentials!

### 1.6 Start Backend Service

```bash
npm start
# Or for development:
npm run dev
```

Verify it's running:

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🔧 Step 2: Configure Next.js App

### 2.1 Add Environment Variable

In your Next.js `.env.local` file, add:

```env
BACKEND_API_URL=http://localhost:3001
```

**For production:**

```env
BACKEND_API_URL=https://your-backend-domain.com
```

### 2.2 Verify API Route

The backend proxy route is already created at:

- `app/api/backend/parse-syllabus/route.ts`

This route will automatically be used when `BACKEND_API_URL` is set.

---

## 🧪 Step 3: Test the Integration

### 3.1 Start Both Services

**Terminal 1 - Backend Service:**

```bash
cd backend-service
npm start
```

**Terminal 2 - Next.js App:**

```bash
cd /path/to/your/nextjs-app
npm run dev
```

### 3.2 Test Flow

1. Open http://localhost:3000
2. Login/Register
3. Go to `/courses/new`
4. Upload a syllabus PDF or image
5. Click "Upload & Process"
6. Check backend service logs for API calls
7. Verify parsed data appears in course creation form

---

## 📊 Step 4: Verify Integration

### 4.1 Check Backend Logs

You should see logs like:

```
Processing file: syllabus.pdf for user: user-123
Calling CLOVA OCR...
OCR extracted 5432 characters
Calling CLOVA Studio...
Cached result for file: syllabus.pdf
```

### 4.2 Check Next.js Logs

You should see successful responses from the backend.

### 4.3 Verify Database

Check that `syllabus_uploads` table has:

- `status` = "completed"
- `parsed_data` contains JSON with course information

---

## 🔍 Step 5: Troubleshooting

### Issue: "Backend service error"

**Solution:**

- Check if backend service is running: `curl http://localhost:3001/health`
- Verify `BACKEND_API_URL` in `.env.local`
- Check backend service logs for errors

### Issue: "NAVER API credentials not configured"

**Solution:**

- Verify `.env` file in backend service has `NAVER_CLIENT_ID` and `NAVER_CLIENT_SECRET`
- Check credentials are correct (no extra spaces)

### Issue: "CLOVA OCR API error"

**Solution:**

- Verify API endpoint URL is correct
- Check API credentials are valid
- Verify file format is supported (PDF, JPEG, PNG)
- Check file size limits

### Issue: "Failed to parse structured data"

**Solution:**

- Check CLOVA Studio API endpoint is correct
- Verify prompt format in `server.js`
- Check response format from CLOVA Studio
- Review backend service logs for detailed errors

---

## 🎯 Step 6: Production Deployment

### 6.1 Deploy Backend Service

Options:

- **Vercel** (Serverless Functions)
- **Railway**
- **Render**
- **AWS Lambda**
- **Your own server**

### 6.2 Update Environment Variables

**Next.js (Vercel/Production):**

```env
BACKEND_API_URL=https://your-backend-domain.com
```

**Backend Service:**

```env
PORT=3001
NAVER_CLIENT_ID=production-client-id
NAVER_CLIENT_SECRET=production-client-secret
CLOVA_OCR_API_URL=https://ocr.apigw.ntruss.com/ocr/v1/document
CLOVA_STUDIO_API_URL=https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002
```

### 6.3 Security Considerations

- ✅ Never commit `.env` files
- ✅ Use environment variables in production
- ✅ Enable HTTPS for backend service
- ✅ Implement proper authentication (JWT verification)
- ✅ Set up rate limiting
- ✅ Monitor API usage and costs

---

## 📝 API Flow Diagram

```
User Uploads File
    ↓
Frontend → POST /api/upload
    ↓
Next.js → Saves file, returns fileId
    ↓
Frontend → POST /api/parse-syllabus
    ↓
Next.js → POST /api/backend/parse-syllabus
    ↓
Backend Service → POST /api/naver/parse-syllabus
    ↓
Backend → CLOVA OCR API (extract text)
    ↓
Backend → CLOVA Studio API (extract structured data)
    ↓
Backend → Returns parsed data
    ↓
Next.js → Updates database, returns to frontend
    ↓
Frontend → Shows course creation form
```

---

## 🔐 Security Best Practices

1. **Authentication:**

   - Backend should verify JWT tokens from Next.js
   - Don't trust user IDs from headers alone

2. **Rate Limiting:**

   - Already implemented (10 req/min per user)
   - Adjust based on your needs

3. **Caching:**

   - Prevents duplicate API calls
   - Reduces costs
   - Improves performance

4. **Error Handling:**
   - Don't expose internal errors to frontend
   - Log errors for debugging
   - Return user-friendly messages

---

## 📚 Additional Resources

- [NAVER Cloud Platform Documentation](https://guide.ncloud.com/)
- [CLOVA OCR API Reference](https://api.ncloud-docs.com/docs/ai-application-service-ocr-ocr)
- [CLOVA Studio API Reference](https://www.ncloud.com/product/aiService/clovaStudio)

---

## ✅ Checklist

- [ ] Backend service created and running
- [ ] NAVER API credentials configured
- [ ] `.env.local` updated with `BACKEND_API_URL`
- [ ] Tested file upload and parsing
- [ ] Verified parsed data in database
- [ ] Checked error handling
- [ ] Production environment variables set
- [ ] Backend service deployed
- [ ] Monitoring and logging set up

---

## 🎉 You're Done!

Your NAVER AI integration is now complete using the backend proxy approach. The system will:

1. ✅ Securely store API credentials on backend
2. ✅ Handle rate limiting and caching
3. ✅ Extract text using CLOVA OCR
4. ✅ Extract structured data using CLOVA Studio
5. ✅ Return parsed course information to frontend

Happy coding! 🚀
