import React from "react";
import { Link } from "react-router-dom";

export const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/">Mixed Media Arts</Link>
          </div>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {" "}
            {darkMode ? "Light Mode" : "Dark Mode"}{" "}
          </button>
          <ul className="nav-links">
            <li>
              <Link to="/">Watch List</Link>
            </li>

            <li>
              <Link to="/watched">Watched</Link>
            </li>

            <li>
              <Link to="/add" className="btn">
                + Add
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
