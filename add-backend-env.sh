#!/bin/bash

# Script to add environment variables to backend Vercel project

cd BE

echo "🔐 Adding environment variables to backend..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found in BE directory"
    exit 1
fi

# Source environment variables
export $(cat .env | xargs)

# Add environment variables one by one
echo "Adding SECRET_KEY_OCR..."
echo "$SECRET_KEY_OCR" | vercel env add SECRET_KEY_OCR production --yes

echo "Adding CLOVA_OCR_URL..."
echo "$CLOVA_OCR_URL" | vercel env add CLOVA_OCR_URL production --yes

echo "Adding CLOVA_STUDIO_API_KEY..."
echo "$CLOVA_STUDIO_API_KEY" | vercel env add CLOVA_STUDIO_API_KEY production --yes

echo "Adding CLOVA_STUDIO_URL..."
echo "$CLOVA_STUDIO_URL" | vercel env add CLOVA_STUDIO_URL production --yes

# Add DB credentials if they exist
if [ ! -z "$DB_HOST" ]; then
    echo "Adding DB_HOST..."
    echo "$DB_HOST" | vercel env add DB_HOST production --yes
fi

if [ ! -z "$DB_USER" ]; then
    echo "Adding DB_USER..."
    echo "$DB_USER" | vercel env add DB_USER production --yes
fi

if [ ! -z "$DB_PASSWORD" ]; then
    echo "Adding DB_PASSWORD..."
    echo "$DB_PASSWORD" | vercel env add DB_PASSWORD production --yes
fi

if [ ! -z "$DB_NAME" ]; then
    echo "Adding DB_NAME..."
    echo "$DB_NAME" | vercel env add DB_NAME production --yes
fi

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Now deploying backend..."
vercel --prod --yes

cd ..

