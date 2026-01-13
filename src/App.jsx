import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/upload" element={<Upload></Upload>}></Route>
        <Route path="/result" element={<Result></Result>}></Route>
      </Routes>
    </>
  );
}

export default App;
