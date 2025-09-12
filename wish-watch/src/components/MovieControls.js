import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const MovieControls = ({ movie, type }) => {
  const {
    removeMoviefromWatchlist,
    addMovietoWatched,
    movetoWatchlist,
    removeMoviefromWatched,
  } = useContext(GlobalContext);

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
        return "MOVIE";
      case "anime":
        return "ANIME";
      case "book":
        return "BOOK";
      case "cartoon":
        return "CARTOON";
      case "music":
        return "MUSIC";
      case "tv":
        return "TV";
      case "game":
        return "GAME";
      default:
        return "?";
    }
  };

  return (
    <div className="inner-card-controls">
      <button
        className="media-type-btn"
        onClick={() =>
          window.open(
            `https://www.google.com/search?q=${title} ` +
              `${getTypeLabel(movie.type)}`,
            "_blank",
            "noopener noreferrer"
          )
        }
      >
        {getTypeLabel(movie.type)}
      </button>

      <div className="ctrl-btns">
        {type === "watchlist" && (
          <>
            <button
              className="ctrl-btn"
              onClick={() => addMovietoWatched(movie)}
            >
              <i className="fa-fw far fa-eye"></i>
            </button>

            <button
              className="ctrl-btn"
              onClick={() => removeMoviefromWatchlist(movie.id)}
            >
              <i className="fa-fw fa fa-times"></i>
            </button>
          </>
        )}

        {type === "watched" && (
          <>
            <button className="ctrl-btn" onClick={() => movetoWatchlist(movie)}>
              <i className="fa-fw far fa-eye-slash"></i>
            </button>
            <button
              className="ctrl-btn"
              onClick={() => removeMoviefromWatched(movie.id)}
            >
              <i className="fa-fw fa fa-times"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
