import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import { ChatBot } from "../chatbot/Chatbot";
import { FaCommentDots } from "react-icons/fa";
import "../chatbot/Chatbot.css";

export const Watched = () => {
  const { watched } = useContext(GlobalContext);

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Watched</h1>
          <span className="count-pill">
            {watched.length} {watched.length === 1 ? "Work" : "Works"}
          </span>
        </div>

        {watched.length > 0 ? (
          <div className="movie-grid">
            {watched.map((movie) => (
              <MovieCard movie={movie} type="watched" />
            ))}
          </div>
        ) : (
          <h2 className="no-movies">
            Watch Something! Play Something! Read Something!
          </h2>
        )}

        <button
          className="chat-toggle-button"
          onClick={() => setShowChat(!showChat)}
          aria-label="Open chat"
        >
          <FaCommentDots size={20} />
        </button>

        {showChat && (
          <div className="floating-chat">
            <ChatBot />
          </div>
        )}
      </div>
    </div>
  );
};
