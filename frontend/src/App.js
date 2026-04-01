import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./Homepage";
import "./styles.css";
import Flavors from "./FlavoursPage"
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import React from "react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/FlavoursPage" element={<Flavors isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/login" element={<LoginPage isLoggedIn = {isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path = "/signup" element={<SignupPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
