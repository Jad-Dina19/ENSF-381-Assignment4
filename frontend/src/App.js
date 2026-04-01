import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Homepage";
import "./styles.css";
import Flavors from "./FlavoursPage"
import LoginPage from "./LoginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FlavoursPage" element={<Flavors />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
