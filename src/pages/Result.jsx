import { useLocation } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const image = location.state?.image;

  return (
    <>
      <h1>Your Styling Result</h1>
      {image ? (
        <img src={image} alt="result preview"></img>
      ) : (
        <p>No Image Found</p>
      )}
    </>
  );
}
