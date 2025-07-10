import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MovieCard } from "./MovieCard";
import { ChatBot } from "../chatbot/Chatbot";
import { FaCommentDots } from "react-icons/fa";
import "../chatbot/Chatbot.css";

export const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">My Watchlist</h1>
          <span className="count-pill">
            {watchlist.length} {watchlist.length === 1 ? "Work" : "Works"}
          </span>
        </div>

        {watchlist.length > 0 ? (
          <div className="movie-grid">
            {watchlist.map((movie) => (
              <MovieCard movie={movie} type="watchlist" />
            ))}
          </div>
        ) : (
          <h2 className="no-movies">There are no Works in your Watchlist</h2>
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
