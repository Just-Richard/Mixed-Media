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

      <MovieControls type={type} movie={movie} />
    </div>
  );
};
