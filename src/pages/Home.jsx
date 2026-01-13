import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Styler- Your Fashion Buddy</h1>
      <Link to="/upload">
        <button>Upload</button>
      </Link>
    </>
  );
}
