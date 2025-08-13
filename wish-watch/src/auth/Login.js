import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Login</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <input
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>{" "}
          <br /> <br />
          <div className="input-wrapper password-wrapper">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>{" "}
          <br /> <br />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
        <p>{message}</p>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};
