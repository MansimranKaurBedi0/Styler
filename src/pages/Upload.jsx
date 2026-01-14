import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Upload() {
  const [files, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFile(file);
    }
  }
  async function handleSubmit(e) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", files);
      await axios.post("http://localhost:5001/upload", formData);
      const analysis = await axios.post("http://localhost:5001/analyze-style");
      setLoading(false);
      navigate("/result", {
        state: {
          image,
          score: analysis.data.score,
          suggestions: analysis.data.suggestions,
        },
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Something went wrong");
    }
  }
  return (
    <>
      <h1>Upload your Image</h1>
      <input type="file" onChange={handleImage} accept="image/*"></input>
      {image && <img src={image} alt="preview"></img>}
      <br></br>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Get Style Score"}
      </button>
    </>
  );
}
