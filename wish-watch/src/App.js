import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Add } from "./components/Add";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header";
import { GlobalProvider } from "./context/GlobalState";
import { Login } from "./auth/Login";
import { Profile } from "./auth/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./auth/Register";
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
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <Routes>
            <Route exact path="/" element={<Watchlist />} />

            <Route path="/watched" element={<Watched />} />

            <Route path="/add" element={<Add />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
