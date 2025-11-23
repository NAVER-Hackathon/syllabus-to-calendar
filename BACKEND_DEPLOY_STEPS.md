# Deploy Backend - Step by Step

## Method 1: Automated Script (Easiest) ⭐

Run this script to deploy the backend automatically:

```bash
cd /Users/dylantran/Documents/dev/s2p/syllabus-to-calendar
./deploy-backend.sh
```

The script will:
1. ✅ Check if BE/.env exists
2. ✅ Validate required environment variables
3. ✅ Deploy backend to Vercel
4. ✅ Show you the deployed URL

**After the script completes:**
1. Copy the deployed URL (e.g., `https://syllabus-to-calendar-xyz.vercel.app`)
2. Add it to frontend (see Step 2 below)

---

## Method 2: Manual Deployment via CLI

If the script doesn't work, deploy manually:

```bash
cd /Users/dylantran/Documents/dev/s2p/syllabus-to-calendar/BE
vercel --prod --yes
```

When prompted for project setup:
- Project name: `syllabus-to-calendar-backend` (or similar)
- Directory is correct: Yes

**After deployment:**
- Copy the deployed URL
- Continue to Step 2 below

---

## Step 2: Add BACKEND_API_URL to Frontend

Once backend is deployed, add the URL to your frontend:

### Option A: Via CLI
```bash
cd /Users/dylantran/Documents/dev/s2p/syllabus-to-calendar

# Add for production
vercel env add BACKEND_API_URL production
# Paste your backend URL when prompted

# Add for preview
vercel env add BACKEND_API_URL preview
# Paste your backend URL when prompted

# Add for development
vercel env add BACKEND_API_URL development
# Paste your backend URL when prompted
```

### Option B: Via Vercel Dashboard
1. Go to: https://vercel.com/van-trans-projects-5c55ea5c/syllabus-to-calendar/settings/environment-variables
2. Click "Add New"
3. **Key**: `BACKEND_API_URL`
4. **Value**: Your backend URL (e.g., `https://syllabus-to-calendar-backend.vercel.app`)
5. Select all environments: Production, Preview, Development
6. Click "Save"

---

## Step 3: Redeploy Frontend

After adding BACKEND_API_URL:

```bash
cd /Users/dylantran/Documents/dev/s2p/syllabus-to-calendar
cd FE
vercel --prod --yes
```

Or trigger redeploy from Vercel Dashboard:
- https://vercel.com/van-trans-projects-5c55ea5c/syllabus-to-calendar
- Click "Redeploy"

---

## Step 4: Test the Full Flow

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Upload a syllabus image/PDF**
3. **Watch it parse** - Should work now!

---

## Troubleshooting

### Backend deployment fails?
- Check BE/.env has all required variables:
  ```bash
  cat BE/.env | grep -E "SECRET_KEY_OCR|CLOVA_"
  ```
- Make sure values are not placeholders (no "your_api_key_here")

### Backend deploys but parse still fails?
- Check backend logs:
  ```bash
  vercel logs https://your-backend-url.vercel.app --since 5m
  ```
- Verify NAVER Clova credentials are correct
- Test backend directly: Visit `https://your-backend-url.vercel.app` (should show HTML page)

### Frontend still shows 500 error?
- Verify BACKEND_API_URL is set correctly
- Make sure you redeployed frontend after adding BACKEND_API_URL
- Check frontend logs for the actual backend URL it's calling

---

## Quick Summary

```bash
# 1. Deploy backend
cd /Users/dylantran/Documents/dev/s2p/syllabus-to-calendar
./deploy-backend.sh

# 2. Copy the URL, then add to frontend
vercel env add BACKEND_API_URL production
# Paste URL when prompted

# 3. Redeploy frontend
cd FE
vercel --prod --yes

# 4. Test!
```

That's it! 🎉

