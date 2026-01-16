const express=require('express');
const router=express.Router();
const sharp = require("sharp");
const upload = require("../multer");

function getColorName(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = (r + g + b) / 3;
  const saturation = max - min;

  // Greyscale
  if (saturation < 20) {
    if (brightness < 60) return "Black";
    if (brightness > 200) return "White";
    return "Grey";
  }

  // Pink / Purple
  if (r > 150 && b > 150 && g < 120) return "Purple";
  if (r > 180 && g < 140 && b > 160) return "Pink";

  // Beige / Brown
  if (r > 200 && g > 180 && b > 140) return "Beige";
  if (r > 120 && g > 70 && b < 80) return "Brown";

  // Primary colors
  if (r > g && r > b) return "Red";
  if (g > r && g > b) return "Green";
  if (b > r && b > g) return "Blue";
  return "Neutral";
}

/* ---------------- ANALYZE ROUTE ---------------- */

router.post("/analyze-style", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Resize for faster processing
    const { data, info } = await sharp(req.file.path)
      .resize(60, 60)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorCount = {};

    // Sample pixels (skip for performance)
    for (let i = 0; i < data.length; i += info.channels * 8) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const color = getColorName(r, g, b);
      colorCount[color] = (colorCount[color] || 0) + 1;
    }

    // Top 3 dominant colors
    const dominantColors = Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(item => item[0]);

    // Tone logic (based on overall brightness feel)
    let tone = "balanced";
    if (dominantColors.includes("Black")) tone = "dark";
    if (dominantColors.includes("White") && dominantColors.length === 1)
      tone = "bright";

    // Suggestions
    let suggestion = "Outfit looks balanced.";
    if (tone === "dark") {
      suggestion = "Dark outfit detected. Lighter colors can improve contrast.";
    } else if (tone === "bright") {
      suggestion = "Bright outfit detected. Neutral shades can balance the look.";
    }

    res.json({
      success: true,
      dominantColors, // 👈 REAL screen-like colors
      tone,
      suggestion,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Image analysis failed",
    });
  }
});

module.exports=router;