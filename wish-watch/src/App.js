import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Add } from "./components/Add";
import { Header } from "./components/Header";
import { GlobalProvider } from "./context/GlobalState";
import { Watched } from "./components/Watched";
import { Watchlist } from "./components/Watchlist";
import "./App.css";
import "./lib/font-awesome/css/all.min.css";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Header></Header>

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
