import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Upload() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }
  function handleSubmit(e) {
    navigate("/result", {
      state: {
        image,
      },
    });
  }
  return (
    <>
      <h1>Upload your Image</h1>
      <input type="file" onChange={handleImage} accept="image/*"></input>
      {image && <img src={image} alt="preview"></img>}
      <br></br>
      <button onClick={handleSubmit}>Get Styling</button>
    </>
  );
}
