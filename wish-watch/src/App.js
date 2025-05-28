import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Add } from "./components/Add";
import { Header } from "./components/Header";
import { GlobalProvider } from "./context/GlobalState";
import { Watched } from "./components/Watched";
import { Watchlist } from "./components/Watchlist";
import "./App.css";
import "./lib/font-awesome/css/all.min.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  return (
    <GlobalProvider>
      <Router>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route exact path="/" element={<Watchlist />} />

          <Route path="/watched" element={<Watched />} />

          <Route path="/add" element={<Add />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
