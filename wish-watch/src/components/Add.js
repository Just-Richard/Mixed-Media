import React, { useState } from "react";
import { ResultCard } from "./ResultCard";

export const Add = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [mediaType, setMediaType] = useState("movie");

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
      case "tv":
        url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&query=${searchTerm}`;
        break;
      case "book":
        url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.REACT_APP_BOOKS_KEY}`;
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

      if (mediaType === "book") {
        if (!data.items || data.items.length === 0) {
          setResults([]);
          return;
        }

        setResults(data.items);
      } else if (mediaType === "anime") {
        const anime = (data.results || []).filter(
          (item) =>
            item.origin_country?.includes("JP") && item.genre_ids?.includes(16)
        );
        setResults(anime);
      } else if (mediaType === "tv") {
        const tv = (data.results || []).filter(
          (item) =>
            !item.origin_country?.includes("JP") &&
            !item.genre_ids?.includes(16)
        );
        setResults(tv);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
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
              {results.map((media) => (
                <li key={media.id || media.id?.videoId}>
                  {" "}
                  <ResultCard movie={media} />
                </li>
              ))}{" "}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
