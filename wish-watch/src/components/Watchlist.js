import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);

  return (
    <div>
      {watchlist.map((movie) => (
        <h1>{movie.title}</h1>
      ))}
    </div>
  );
};
