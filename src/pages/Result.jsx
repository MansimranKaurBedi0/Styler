import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const image = location.state?.image;
  useEffect(() => {
    if (!image) {
      navigate("/upload");
    }
  }, [location.state, navigate]);

  return (
    <>
      <h1>Your Styling Result</h1>
      <img
        src={image}
        alt="outfit"
        style={{ width: "220px", marginBottom: "10px" }}
      ></img>
      <h2>Score: {location.state.score}/10 ⭐</h2>
      <h3>Suggestions:</h3>
      <ul>
        {location.state.suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </>
  );
}
