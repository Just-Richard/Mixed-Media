import React from "react";
import { MovieControls } from "./MovieControls";

export const MovieCard = ({ movie, type }) => {
  const poster =
    movie.poster_url ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : movie.volumeInfo?.imageLinks?.thumbnail ||
        movie.background_image ||
        movie.image ||
        null);

  const title =
    movie?.title ||
    movie?.name ||
    movie?.volumeInfo?.title ||
    movie?.original_title ||
    movie?.original_name ||
    "Untitled";

  const getTypeLabel = (t) => {
    switch (t) {
      case "movie":
        return "MV";
      case "anime":
        return "A";
      case "book":
        return "B";
      case "cartoon":
        return "C";
      case "music":
        return "M";
      case "tv":
        return "TV";
      case "game":
        return "VG";
      default:
        return "?";
    }
  };

  return (
    <div className="movie-card">
      <div className="overlay"></div>
      <div className="poster-wrapper-obj">
        {poster ? (
          <img src={poster} alt={`${title} Poster`} />
        ) : (
          <div className="filler-poster"></div>
        )}
        <div className="hover-title">
          <span>{title}</span>
        </div>
      </div>

      <div className="movie-footer">
        <a
          href={`https://www.google.com/search?q=${title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="media-type-badge"
        >
          {getTypeLabel(movie.type)}
        </a>

        <MovieControls type={type} movie={movie} />
      </div>
    </div>
  );
};
