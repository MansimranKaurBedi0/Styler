const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require("../multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/analyze-style", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: "GEMINI_API_KEY is missing in backend/.env file. Please add your free Gemini API key to use the AI." 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-flash-latest as it is fast and supports multimodal
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Read the image file into a base64 string
    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;
    const imageBytes = fs.readFileSync(imagePath).toString("base64");

    const prompt = `Analyze this clothing image. Give me the top 2 or 3 dominant colors of the outfit, the overall tone (must be exactly 'dark', 'bright', or 'balanced'), and a short, excellent styling suggestion. 
    Return ONLY a valid JSON object in this exact format, with no markdown formatting or backticks:
    {
      "dominantColors": ["Color1", "Color2"],
      "tone": "balanced",
      "suggestion": "Your styling suggestion here."
    }`;

    const imageParts = [
      {
        inlineData: {
          data: imageBytes,
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up the JSON string in case the model adds backticks
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiData;
    try {
      aiData = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", cleanedText);
      return res.status(500).json({ success: false, message: "AI response parsing failed" });
    }

    res.json({
      success: true,
      dominantColors: aiData.dominantColors || ["Unknown"],
      tone: aiData.tone || "balanced",
      suggestion: aiData.suggestion || "Outfit looks great!"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Image analysis failed. Make sure your Gemini API key is valid."
    });
  }
});

module.exports = router;