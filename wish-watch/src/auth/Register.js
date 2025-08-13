import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      // Create row in users table
      await supabase.from("users").insert([{ id: data.user.id, username }]);
      setMessage("/login");
    }
  };

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Register</h1>
        </div>
        <form onSubmit={handleRegister}>
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
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>{" "}
          <br /> <br />
          <div className="input-wrapper">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>{" "}
          <br /> <br />
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <p>{message}</p>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
