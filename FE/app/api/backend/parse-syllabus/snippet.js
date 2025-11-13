const backendResponse = await fetch(
  `${BACKEND_API_URL}/api/naver/parse-syllabus`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.userId}`, // user context
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64File, // syllabus or screenshot, base64
      fileName: originalName, // original filename
      mimeType: storedMimeType || detectedMime, // e.g. application/pdf, image/png
    }),
  }
);
