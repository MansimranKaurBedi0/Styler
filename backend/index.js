const express=require('express');
const cors=require('cors');
const upload = require("./multer");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("AI Styler Backend Running");
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  res.json({
    success: true,
    filename: req.file.filename,
  });
});


app.post("/analyze-style", (req, res) => {
  // Dummy AI response
  res.json({
    score: 7,
    suggestions: [
      "Color combination is decent",
      "Try better fitting clothes",
      "Add minimal accessories",
      "Footwear could match the outfit better"
    ],
  });
});

app.listen(5001, () => {
  console.log("Server running on port 5000");
});