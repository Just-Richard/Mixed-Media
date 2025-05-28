import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const ResultCard = ({ movie }) => {
  const { addMovietoWatchlist, watchlist, watched, addMovietoWatched } =
    useContext(GlobalContext);

  let storedMovie = watchlist.find((o) => o.id === movie.id);
  let storedMovieWatched = watched.find((o) => o.id === movie.id);

  const watchlistDisabled = storedMovie
    ? true
    : storedMovieWatched
    ? true
    : false;

  const watchedDisabled = storedMovieWatched ? true : false;

  const title =
    movie.title || movie.name || movie.volumeInfo?.title || "Untitled";

  const image = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : movie.volumeInfo?.imageLinks?.thumbnail || movie.background_image || null;

  const date =
    movie.release_date ||
    movie.first_air_date ||
    movie.volumeInfo?.publishedDate ||
    movie.released ||
    "-";

  return (
    <div className="result-card">
      <div className="poster-wrapper">
        {image ? (
          <img src={image} alt={`${title} Poster`} />
        ) : (
          <div className="filler-poster"></div>
        )}
      </div>

      <div className="info">
        <div className="header">
          <h3 className="title"> {title} </h3>
          <h4 className="release-date">{date.substring(0, 4)}</h4>
        </div>

        <div className="controls">
          <button
            className="btn"
            disabled={watchlistDisabled}
            onClick={() => addMovietoWatchlist(movie)}
          >
            Add to Watchlist
          </button>

          <button
            className="btn"
            disabled={watchedDisabled}
            onClick={() => addMovietoWatched(movie)}
          >
            Watched
          </button>
        </div>
      </div>
    </div>
  );
};
