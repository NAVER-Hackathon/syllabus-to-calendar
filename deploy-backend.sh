#!/bin/bash

# Backend Deployment Script for Vercel
# This script deploys the backend and sets up environment variables

set -e

echo "🚀 Deploying Backend to Vercel"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f "BE/.env" ]; then
    echo "❌ Error: BE/.env file not found"
    echo "Please create BE/.env with your NAVER Clova credentials"
    exit 1
fi

echo "📋 Found BE/.env file"
echo ""

# Source the .env file to get variables
export $(cat BE/.env | grep -E "SECRET_KEY_OCR|CLOVA_OCR_URL|CLOVA_STUDIO_API_KEY|CLOVA_STUDIO_URL|DB_" | xargs)

echo "🔍 Checking environment variables..."
if [ -z "$SECRET_KEY_OCR" ]; then
    echo "❌ SECRET_KEY_OCR not found in BE/.env"
    exit 1
fi

if [ -z "$CLOVA_OCR_URL" ]; then
    echo "❌ CLOVA_OCR_URL not found in BE/.env"
    exit 1
fi

if [ -z "$CLOVA_STUDIO_API_KEY" ]; then
    echo "❌ CLOVA_STUDIO_API_KEY not found in BE/.env"
    exit 1
fi

if [ -z "$CLOVA_STUDIO_URL" ]; then
    echo "❌ CLOVA_STUDIO_URL not found in BE/.env"
    exit 1
fi

echo "✅ All required environment variables found"
echo ""

# Change to BE directory
cd BE

echo "🌐 Deploying backend to Vercel..."
echo ""

# Deploy to Vercel
vercel --prod --yes

echo ""
echo "✅ Backend deployed!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the deployed URL from above"
echo "2. Add BACKEND_API_URL to frontend environment variables:"
echo "   vercel env add BACKEND_API_URL production"
echo "3. Paste the backend URL when prompted"
echo "4. Redeploy frontend"
echo ""

