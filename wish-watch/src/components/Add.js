import React, { useState } from "react";
import { ChatBot } from "../chatbot/Chatbot";
import { FaCommentDots } from "react-icons/fa";
import "../chatbot/Chatbot.css";
import { ResultCard } from "./ResultCard";

export const Add = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [mediaType, setMediaType] = useState("movie");

  const [showChat, setShowChat] = useState(false);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    let url = "";
    let headers = {};

    switch (mediaType) {
      case "movie":
        url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`;
        break;
      case "anime":
      case "cartoon":
      case "tv":
        url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&query=${searchTerm}`;
        break;
      case "book":
        url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.REACT_APP_BOOKS_KEY}`;
        break;
      case "music":
        url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchTerm}&api_key=${process.env.REACT_APP_MUSIC_KEY}&format=json`;
        break;
      case "game":
        url = `https://api.rawg.io/api/games?search=${searchTerm}&key=${process.env.REACT_APP_GAMES_KEY}`;
        break;
      default:
        return;
    }

    try {
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!data || data.errors) {
        setResults([]);
        return;
      }

      if (mediaType === "movie") {
        setResults(
          (data.results || []).map((item) => ({ ...item, type: "movie" }))
        );
      } else if (mediaType === "book") {
        const books = (data.items || []).map((item) => ({
          ...item,
          type: "book",
        }));
        setResults(books);
      } else if (mediaType === "anime") {
        const anime = (data.results || [])
          .filter(
            (item) =>
              item.origin_country?.includes("JP") &&
              item.genre_ids?.includes(16)
          )
          .map((item) => ({ ...item, type: "anime" }));
        setResults(anime);
      } else if (mediaType === "cartoon") {
        const cartoons = (data.results || [])
          .filter(
            (item) =>
              !item.origin_country?.includes("JP") &&
              item.genre_ids?.includes(16)
          )
          .map((item) => ({ ...item, type: "cartoon" }));
        setResults(cartoons);
      } else if (mediaType === "music") {
        const albums = data.results?.albummatches?.album || [];

        if (!albums.length) {
          setResults([]);
          return;
        }

        const filteredAlbums = albums.filter((album) => {
          const hasImage = album.image?.find(
            (img) => img.size === "extralarge"
          )?.["#text"];
          const hasTitle = album.name && album.artist;
          return hasImage && hasTitle;
        });

        const mappedAlbums = filteredAlbums.map((item) => ({
          id: item.mbid || item.url,
          title: item.name,
          artist: item.artist,
          image:
            item.image?.find((img) => img.size === "extralarge")?.["#text"] ||
            null,
          type: "music",
        }));
        setResults(mappedAlbums);
      } else if (mediaType === "tv") {
        const tv = (data.results || [])
          .filter(
            (item) =>
              !item.origin_country?.includes("JP") &&
              !item.genre_ids?.includes(16)
          )
          .map((item) => ({ ...item, type: "tv" }));
        setResults(tv);
      } else if (mediaType === "game") {
        const games = (data.results || []).map((item) => ({
          ...item,
          type: "game",
        }));
        setResults(games);
      }
    } catch (err) {
      console.error("Search Failed:", err);
      setResults([]);
    }
  };

  const onInputChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    handleSearch(searchTerm);
  };

  return (
    <div className="add-page">
      <div className="container">
        <div className="add-content">
          <div className="input-wrapper">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="movie"> Movies </option>
              <option value="anime"> Anime </option>
              <option value="book"> Books </option>
              <option value="cartoon"> Cartoons </option>
              <option value="music"> Music </option>
              <option value="tv"> TV Shows </option>
              <option value="game"> Video Games </option>
            </select>{" "}
            <br /> <br />
            <input
              type="text"
              placeholder="Search for Anything..."
              value={query}
              onChange={onInputChange}
            />
          </div>

          {results.length > 0 && (
            <ul className="results">
              {" "}
              {results.map((movie) => (
                <li key={movie.id || movie.id?.videoId}>
                  {" "}
                  <ResultCard movie={movie} />
                </li>
              ))}{" "}
            </ul>
          )}
        </div>
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
