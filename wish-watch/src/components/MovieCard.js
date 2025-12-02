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

  const openCloneForType = () => {
    const movieId = movie?.media_id;

    const resolveMediaType = () => {
      if (movie.type === "movie") return "movie";
      if (movie.type === "tv") return "tv";

      if (movie.type === "anime") return "tv";
      if (movie.type === "cartoon") return "tv";

      return "movie";
    };

    const movieType = resolveMediaType();

    let url = "";

    switch (movie.type) {
      case "movie":
      case "tv":
      case "anime":
      case "cartoon":
        url = `https://netflix-project-just-richards-projects.vercel.app/player/${movieId}?media=${movieType}`;
        break;

      case "music":
        url = "https://spotify-project-just-richards-projects.vercel.app/";
        break;

      case "book":
        url = `https://amazon-project-just-richards-projects.vercel.app/productMMA.html?id=${movie.media_id}&type=book`;
        break;

      case "game":
        url = `https://amazon-project-just-richards-projects.vercel.app/productMMA.html?id=${movie.media_id}&type=game`;
        break;

      default:
        return;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="movie-card">
      <div className="overlay"></div>
      <div
        className="poster-wrapper-obj"
        onClick={openCloneForType}
        style={{ cursor: "pointer" }}
      >
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
