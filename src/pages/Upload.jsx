import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Upload() {
  const [files, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ["Shirt", "Pants", "Dress", "Shoes", "Bag", "Accessories", "Jacket"];

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFile(file);
    }
  }

  function toggleItem(item) {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  async function handleSubmit() {
    try {
      if (!files) {
        alert("Please select an image");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("image", files);

      const analysis = await axios.post(
        "http://localhost:5001/analyze-style",
        formData,
      );

      setLoading(false);

      navigate("/result", {
        state: {
          image,
          analysis: analysis.data,
          clothingType: selectedItems.join(" and "),
        },
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong";
      alert("Error: " + errorMessage);
    }
  }

  return (
    <div className="glass-card">
      <h1>AI Style Analyzer ✨</h1>
      <p>Upload your outfit and get expert styling advice.</p>
      
      <div className="file-input-wrapper">
        <button className="file-input-btn">
          {image ? "Change Image" : "📸 Choose Image"}
        </button>
        <input type="file" onChange={handleImage} accept="image/*" />
      </div>

      {image && <img src={image} alt="preview" className="image-preview" />}
      
      <div style={{ marginTop: "15px" }}>
        <h3>What items are in this look?</h3>
        <div className="pill-container">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`pill ${selectedItems.includes(cat) ? "active" : ""}`}
              onClick={() => toggleItem(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing Style..." : "Get Style Score & Ideas"}
      </button>
    </div>
  );
}
