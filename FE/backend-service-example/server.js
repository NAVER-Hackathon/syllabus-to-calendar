/**
 * Backend Service Example for NAVER AI Integration
 * 
 * This is a Node.js/Express backend service that handles NAVER CLOVA OCR and CLOVA Studio API calls.
 * 
 * Setup:
 * 1. npm init -y
 * 2. npm install express cors dotenv node-cache express-rate-limit crypto
 * 3. Create .env file with NAVER API credentials
 * 4. Run: node server.js
 */

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Support large base64 files

// Cache for storing parsed results (1 hour TTL)
const cache = new NodeCache({ stdTTL: 3600 });

// Rate limiting: 10 requests per minute per user
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyGenerator: (req) => {
    // Extract user ID from Authorization header
    const authHeader = req.headers.authorization;
    return authHeader ? authHeader.replace("Bearer ", "") : req.ip;
  },
  message: "Too many requests, please try again later.",
});

// Simple authentication middleware (replace with your auth logic)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // Extract user ID from token (in production, verify JWT)
  const userId = authHeader.replace("Bearer ", "");
  req.userId = userId;
  next();
};

/**
 * Hash file content for cache key
 */
function hashFile(fileBase64) {
  return crypto.createHash("md5").update(fileBase64).digest("hex");
}

/**
 * Generate request ID for NAVER API
 */
function generateRequestId() {
  return crypto.randomUUID();
}

/**
 * Call CLOVA OCR API to extract text from image/PDF
 */
async function callClovaOCR(fileBase64, mimeType) {
  const OCR_API_URL =
    process.env.CLOVA_OCR_API_URL ||
    "https://ocr.apigw.ntruss.com/ocr/v1/document";
  
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("NAVER API credentials not configured");
  }

  // Determine image format
  let format = "pdf";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    format = "jpg";
  } else if (mimeType.includes("png")) {
    format = "png";
  }

  const response = await fetch(OCR_API_URL, {
    method: "POST",
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "V2",
      requestId: generateRequestId(),
      timestamp: Date.now(),
      images: [
        {
          format: format,
          name: "syllabus",
          data: fileBase64,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CLOVA OCR API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // Extract text from OCR response
  if (data.images && data.images.length > 0) {
    return data.images[0].inferText || "";
  }
  
  throw new Error("No text extracted from OCR response");
}

/**
 * Call CLOVA Studio API to extract structured data from text
 */
async function callClovaStudio(text) {
  const STUDIO_API_URL =
    process.env.CLOVA_STUDIO_API_URL ||
    "https://clovastudio.apigw.ntruss.com/testapp/v1/chat-completions/HCX-002";
  
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("NAVER API credentials not configured");
  }

  const extractionPrompt = `Extract the following information from this course syllabus text and return it as a JSON object:

{
  "courseName": "string (course title)",
  "courseCode": "string (course code/number)",
  "term": "string (semester/term)",
  "instructor": "string (instructor name)",
  "startDate": "YYYY-MM-DD (course start date)",
  "endDate": "YYYY-MM-DD (course end date)",
  "assignments": [
    {
      "title": "string",
      "dueDate": "YYYY-MM-DD",
      "description": "string (optional)"
    }
  ],
  "exams": [
    {
      "title": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM AM/PM (optional)",
      "location": "string (optional)"
    }
  ],
  "classSchedule": [
    {
      "dayOfWeek": 1-7 (1=Monday, 7=Sunday),
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "location": "string (optional)"
    }
  ]
}

Only include fields that are found in the syllabus. Use null for missing dates. Return only valid JSON, no additional text.`;

  const response = await fetch(STUDIO_API_URL, {
    method: "POST",
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: extractionPrompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      maxTokens: 2000,
      temperature: 0.1, // Low temperature for consistent extraction
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CLOVA Studio API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // Extract structured data from response
  if (data.message && data.message.content) {
    try {
      // Parse JSON from response
      const content = data.message.content.trim();
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      
      const jsonText = jsonMatch[1] || content;
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse CLOVA Studio response:", parseError);
      throw new Error("Failed to parse structured data from CLOVA Studio");
    }
  }
  
  throw new Error("No structured data in CLOVA Studio response");
}

/**
 * Main endpoint: Parse syllabus using NAVER AI
 * POST /api/naver/parse-syllabus
 */
app.post("/api/naver/parse-syllabus", authenticate, limiter, async (req, res) => {
  try {
    const { file, fileName, mimeType, uploadId } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "File is required",
      });
    }

    // Check cache
    const fileHash = hashFile(file);
    const cached = cache.get(fileHash);
    if (cached) {
      console.log(`Cache hit for file: ${fileName}`);
      return res.json(cached);
    }

    console.log(`Processing file: ${fileName} for user: ${req.userId}`);

    // Step 1: Call CLOVA OCR to extract text
    console.log("Calling CLOVA OCR...");
    const extractedText = await callClovaOCR(file, mimeType);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "No text could be extracted from the file",
      });
    }

    console.log(`OCR extracted ${extractedText.length} characters`);

    // Step 2: Call CLOVA Studio to extract structured data
    console.log("Calling CLOVA Studio...");
    const structuredData = await callClovaStudio(extractedText);

    // Validate and normalize dates
    if (structuredData.startDate) {
      structuredData.startDate = new Date(structuredData.startDate).toISOString();
    }
    if (structuredData.endDate) {
      structuredData.endDate = new Date(structuredData.endDate).toISOString();
    }

    // Normalize assignment dates
    if (structuredData.assignments) {
      structuredData.assignments = structuredData.assignments.map((a) => ({
        ...a,
        dueDate: a.dueDate
          ? new Date(a.dueDate).toISOString()
          : null,
      }));
    }

    // Normalize exam dates
    if (structuredData.exams) {
      structuredData.exams = structuredData.exams.map((e) => ({
        ...e,
        date: e.date ? new Date(e.date).toISOString() : null,
      }));
    }

    const result = {
      success: true,
      data: structuredData,
    };

    // Cache the result
    cache.set(fileHash, result);
    console.log(`Cached result for file: ${fileName}`);

    res.json(result);
  } catch (error) {
    console.error("Parse syllabus error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to parse syllabus",
    });
  }
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Parse endpoint: http://localhost:${PORT}/api/naver/parse-syllabus`);
});

