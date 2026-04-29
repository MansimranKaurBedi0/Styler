import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const { image, analysis, clothingType } = location.state || {};

  useEffect(() => {
    if (!image || !analysis) {
      navigate("/upload");
    }
  }, [image, analysis, navigate]);

  // tone → score mapping
  const scoreMap = {
    dark: 8,
    balanced: 9,
    bright: 8,
  };

  const score = scoreMap[analysis?.tone] || 7;
  
  // Construct a query for suggestions
  const colors = analysis?.dominantColors?.join(" and ") || "";
  const query = `${clothingType ? clothingType + " " : ""}${colors} outfit style ideas`;
  const pinterestLink = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
  const googleLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

  return (
    <div className="glass-card" style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h1>Your Style Analysis ✨</h1>

      <img
        src={image}
        alt="outfit"
        className="image-preview"
      />

      <div className="result-section">
        {clothingType && (
          <p style={{ marginBottom: "10px", fontSize: "1.1rem" }}>
            <b>Items Detected:</b> <span style={{ color: "var(--primary)", fontWeight: "600" }}>{clothingType.replace(/ and /g, ", ")}</span>
          </p>
        )}
        
        <h2 style={{ fontSize: "2rem", color: "var(--primary)", margin: "15px 0" }}>
          Style Score: {score}/10 ⭐
        </h2>

        <h3>AI Insights</h3>
        <p style={{ marginBottom: "10px" }}>
          <b>Tone:</b> <span style={{ textTransform: "capitalize" }}>{analysis?.tone}</span>
        </p>
        
        <p style={{ marginBottom: "5px" }}><b>Dominant Colors:</b></p>
        <div style={{ marginBottom: "15px" }}>
          {analysis?.dominantColors?.map((color, i) => (
            <span key={i} className="color-swatch">{color}</span>
          ))}
        </div>

        <h3>Dress Sense & Suggestions</h3>
        <p style={{ padding: "10px", background: "#f8f9fa", borderRadius: "10px", borderLeft: "4px solid var(--primary)" }}>
          {analysis?.suggestion}
        </p>
      </div>

      <div className="result-section" style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>Get More Inspiration</h3>
        <p>Discover how to style this exact {clothingType || "look"} with these colors:</p>
        
        <div className="action-links">
          <a 
            href={pinterestLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-pinterest"
          >
            Find on Pinterest 📌
          </a>
          <a 
            href={googleLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-google"
          >
            Search on Google 🔍
          </a>
        </div>
      </div>

      <button className="btn-primary" onClick={() => navigate("/upload")}>
        Analyze Another Outfit
      </button>
    </div>
  );
}
