const axios = require("axios");
const crypto = require("crypto");

async function processWithAI(ocrText, systemPrompt, userPrompt) {
  const { CLOVA_STUDIO_API_KEY, CLOVA_STUDIO_URL } = process.env;
  
  const response = await axios.post(
    CLOVA_STUDIO_URL,
    {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      topP: 0.8,
      topK: 5,
      repeatPenalty: 1.0,
      includeAiFilters: true,
    },
    {
      headers: {
        Authorization: `Bearer ${CLOVA_STUDIO_API_KEY}`,
        "X-NCP-CLOVASTUDIO-REQUEST-ID": crypto.randomBytes(16).toString("hex"),
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      timeout: 60000
    }
  );

  return response.data.result.message.content
    .replace(/```(?:json)?\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

async function extractSyllabusData(ocrText) {
  const systemPrompt = `You are a precise syllabus data extractor. Output only valid JSON.

CRITICAL RULES:
- Return ONLY valid JSON, nothing else
- No markdown, no explanations, no extra text before or after
- All strings must use double quotes, not single quotes
- No trailing commas in arrays or objects
- Default year: 2025, timezone: .000Z
- If no events found: {"success":false,"data":null}

OUTPUT FORMAT:
{"success":true,"data":{"courseName":"N/A","events":[{"type":"assignment","title":"Title","dueDate":"2025-03-15T23:59:00.000Z","description":"Clean description"}]}}

FIELD GUIDE:

courseName:
- Extract from header, remove codes: "Course Name - CS101" → "Course Name"
- If not found → "N/A"

type:
- "assignment": homework, project, lab, paper, essay, report
- "exam": test, quiz, midterm, final, exam

title:
- Extract clean title: "Lab 5", "Assignment 2: Sorting"
- Remove prefixes: "Upload Assignment:", "Submit:"

dueDate:
- ISO 8601 format
- Assignments: 23:59 if no time specified
- Exams: start time if available, else 09:00

description:
- Extract ONLY the meaningful content
- Remove all UI elements: buttons, navigation, generic instructions
- Remove: "Click Submit", "Save Draft", "Cancel", "Home Page", "When finished..."
- Keep: file names, point values, important notes, submission requirements
- Keep it concise, maximum 300 characters

EXAMPLE WITH UI REMOVAL:

OCR: "Upload Assignment: Lab 5 Due: March 20, 100 pts Click Submit When finished Save Draft"
JSON: {"success":true,"data":{"courseName":"N/A","events":[{"type":"assignment","title":"Lab 5","dueDate":"2025-03-20T23:59:00.000Z","description":"Lab 5. 100 points."}]}}`;

  const userPrompt = `Extract assignments and exams. Clean the description by removing UI text.

OCR:
${ocrText}`;

  try {
    const rawResponse = await processWithAI(ocrText, systemPrompt, userPrompt);
    
    // Try to extract JSON from response
    let jsonStr = rawResponse;
    
    // Remove any text before first {
    const firstBrace = jsonStr.indexOf('{');
    if (firstBrace > 0) {
      jsonStr = jsonStr.substring(firstBrace);
    }
    
    // Remove any text after last }
    const lastBrace = jsonStr.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace < jsonStr.length - 1) {
      jsonStr = jsonStr.substring(0, lastBrace + 1);
    }
    
    // Try to parse
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed);
    
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError.message);
    console.error('Raw response:', rawResponse);
    
    // Return fallback response
    return JSON.stringify({
      success: false,
      data: null,
      error: 'Failed to parse AI response'
    });
  }
}

module.exports = { extractSyllabusData };