const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function processOCR(filePath, originalName) {
  const SECRET_KEY_OCR = process.env.SECRET_KEY_OCR;
  const CLOVA_OCR_URL = process.env.CLOVA_OCR_URL;

  const imageFile = fs.readFileSync(filePath);
  const fileExtension = originalName.split('.').pop().toLowerCase();
  
  const formData = new FormData();
  formData.append('message', JSON.stringify({
    version: "V2",
    requestId: `req-${Date.now()}`,
    timestamp: Date.now(),
    images: [{ format: fileExtension, name: "image" }]
  }));
  formData.append('file', imageFile, {
    filename: originalName,
    contentType: `image/${fileExtension}`
  });

  const response = await axios.post(CLOVA_OCR_URL, formData, {
    headers: {
      "X-OCR-SECRET": SECRET_KEY_OCR,
      ...formData.getHeaders()
    },
    timeout: 30000
  });

  return response.data;
}

module.exports = { processOCR };
