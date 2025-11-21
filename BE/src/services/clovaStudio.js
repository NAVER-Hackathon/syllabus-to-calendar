const axios = require("axios");
const crypto = require("crypto");
const { jsonrepair } = require("jsonrepair");

async function processWithAI(ocrText, systemPrompt, userPrompt) {
  const { CLOVA_STUDIO_API_KEY, CLOVA_STUDIO_URL } = process.env;

  const requestBody = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.01,
    topP: 0.1,
    topK: 1,
    repeatPenalty: 1.0,
    includeAiFilters: false,
    stopBefore: ["```json", "```"]
  };

  try {
    const response = await axios.post(
      CLOVA_STUDIO_URL,
      requestBody,
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
  } catch (error) {
    console.error("Clova Studio API Error:");
    if (error.response) {
      console.error("- Status:", error.response.status);
      console.error("- Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("- Message:", error.message);
    }
    throw error;
  }
}


// streaming handle
async function streamAIResponse(res, systemPrompt, userPrompt) {
  const { CLOVA_STUDIO_API_KEY, CLOVA_STUDIO_URL } = process.env;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        CLOVA_STUDIO_URL,
        {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.5,
          stream: true
        },
        {
          headers: {
            Authorization: `Bearer ${CLOVA_STUDIO_API_KEY}`,
            "X-NCP-CLOVASTUDIO-REQUEST-ID": crypto.randomBytes(16).toString("hex"),
            "Content-Type": "application/json",
            Accept: "text/event-stream"
          },
          responseType: "stream"
        }
      );

      let buffer = "";

      response.data.on("data", (chunk) => {

        buffer += chunk.toString();

        let lines = buffer.split("\n");

        buffer = lines.pop();

        lines.forEach((line) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;

          if (trimmedLine.startsWith("data:")) {
            const jsonStr = trimmedLine.replace("data:", "").trim();

            if (jsonStr === "[DONE]") {
              res.write("data: [DONE]\n\n");
              return;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.message?.content || "";

              if (content) {
                process.stdout.write(content);
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {

            }
          }
        });
      });

      response.data.on("end", () => {

        if (buffer.trim() !== "") {
        }
        res.end();
        resolve();
      });

      response.data.on("error", (err) => {
        console.error("Stream Error:", err);
        reject(err);
      });

    } catch (error) {
      console.error("Init Error:", error.message);
      if (!res.headersSent) res.status(500).json({ error: error.message });
      resolve();
    }
  });
}


async function extractSyllabusData(ocrText) {
  const systemPrompt = `You are a pure JSON generator. You parse OCR text into Syllabus JSON.

STRICT OUTPUT RULES:
1. Output ONLY valid JSON. No markdown (occurrences of \`\`\`), no conversation, no introductory text.
2. Default year: 2025.
3. If data is missing/unclear, use null or "N/A".
4. Do not include trailing commas.
5. Always include course startDate and endDate fields (ISO8601). If unknown, set them to null.
6. If instructor name exists, include it; otherwise set to null.

SCHEMA DEFINITION:
{
  "success": boolean,
  "data": {
    "courseName": string,
    "instructor": string | null,
    "startDate": "ISO8601 Date String or null",
    "endDate": "ISO8601 Date String or null",
    "events": [
      {
        "type": "assignment" | "exam",
        "title": string,
        "dueDate": "ISO8601 String (YYYY-MM-DDTHH:mm:ss.sssZ)",
        "description": "Clean string max 300 chars"
      }
    ]
  }
}

### EXAMPLE INPUT:
Course: INTRO TO AI - CS50
Homework 1: Neural Networks
Submit by Oct 12 at 5pm.
Note: Use Python only. Click here to submit.

### EXAMPLE OUTPUT:
{
  "success": true,
  "data": {
    "courseName": "INTRO TO AI",
    "instructor": "Prof. Jane Doe",
    "startDate": "2025-09-01T00:00:00.000Z",
    "endDate": "2025-12-20T00:00:00.000Z",
    "events": [
      {
        "type": "assignment",
        "title": "Homework 1: Neural Networks",
        "dueDate": "2025-10-12T17:00:00.000Z",
        "description": "Use Python only."
      }
    ]
  }
}`;

  const userPrompt = `OCR TEXT TO PARSE:\n${ocrText}\n\nOutput JSON only.`;

  try {
    const rawResponse = await processWithAI(ocrText, systemPrompt, userPrompt);

    let cleanString = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleanString.indexOf("{");
    const lastBrace = cleanString.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in response");
    }

    cleanString = cleanString.substring(firstBrace, lastBrace + 1);

    const repaired = jsonrepair(cleanString);
    const parsed = JSON.parse(repaired);

    if (!parsed.data || !Array.isArray(parsed.data.events)) {
      return JSON.stringify({ success: false, data: null, error: "Invalid Schema Structure" });
    }

    return JSON.stringify(parsed);

  } catch (error) {
    console.error('Extraction Error:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    return JSON.stringify({
      success: false,
      data: null,
      error: 'Failed to parse AI response or API Error'
    });
  }
}

module.exports = { extractSyllabusData, processWithAI, streamAIResponse, };
