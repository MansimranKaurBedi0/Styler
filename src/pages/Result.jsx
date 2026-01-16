import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const { image, analysis } = location.state || {};

  useEffect(() => {
    if (!image || !analysis) {
      navigate("/upload");
    }
  }, [image, analysis, navigate]);

  // tone → score mapping
  const scoreMap = {
    dark: 6,
    balanced: 8,
    bright: 7,
  };

  const score = scoreMap[analysis?.tone] || 7;

  return (
    <>
      <h1>Your Styling Result</h1>

      <img
        src={image}
        alt="outfit"
        style={{ width: "220px", marginBottom: "10px" }}
      />

      <h2>Score: {score}/10 ⭐</h2>

      <h3>Analysis:</h3>
      <p>
        <b>Tone:</b> {analysis.tone}
      </p>
      <p>
        <b>Dominant Color:</b>
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        {analysis?.dominantColors?.map((color, i) => (
          <span key={i}>{color}</span>
        ))}
      </div>

      <h3>Suggestions:</h3>
      <ul>
        <li>{analysis.suggestion}</li>
      </ul>
    </>
  );
}
