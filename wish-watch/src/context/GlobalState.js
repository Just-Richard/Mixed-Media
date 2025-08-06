import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";
import { supabase } from "../supabase/supabaseClient";

//initial state
const initialState = {
  watchlist: [],
  watched: [],
  user: null,
};

//create context
export const GlobalContext = createContext(initialState);

//provider components
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        dispatch({ type: "SET_USER", payload: user });
        await loadWatchlist(user.id);
        await loadWatched(user.id);
      }
    };
    loadUserData();
  }, []);

  const loadWatchlist = async (userId) => {
    const { data, error } = await supabase
      .from("media_list")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "watchlist");

    if (!error) {
      dispatch({ type: "SET_WATCHLIST", payload: data });
    }
  };

  const loadWatched = async (userId) => {
    const { data, error } = await supabase
      .from("media_list")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "watched");

    if (!error) {
      dispatch({ type: "SET_WATCHED", payload: data });
    }
  };

  //actions
  const addMovietoWatchlist = async (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: movie });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("media_list").insert([
        {
          user_id: user.id,
          title: movie.title || movie.name,
          type: movie.type,
          status: "watchlist",
          poster_url: movie.poster_path || movie.image,
        },
      ]);
    }
  };

  //remove from watchlist
  const removeMoviefromWatchlist = (id) => {
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: id });
  };

  //move from watchlist to watched
  const addMovietoWatched = async (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHED", payload: movie });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("media_list").insert([
        {
          user_id: user.id,
          title: movie.title || movie.name,
          type: movie.type,
          status: "watched",
          poster_url: movie.poster_path || movie.image,
        },
      ]);
    }
  };

  //move from watched to watchlist
  const movetoWatchlist = (movie) => {
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: movie });
  };

  //remove from watched
  const removeMoviefromWatched = (id) => {
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHED", payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        user: state.user,
        addMovietoWatchlist,
        removeMoviefromWatchlist,
        addMovietoWatched,
        movetoWatchlist,
        removeMoviefromWatched,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
