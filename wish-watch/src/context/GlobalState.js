import React, { createContext, useReducer, useEffect, useState } from "react";
import AppReducer from "./AppReducer";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "./AuthContext";

// Initial state
const initialState = {
  watchlist: [],
  watched: [],
  profile: null, // <-- add profile here
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // ---- LOAD WATCHLIST + WATCHED ----
  useEffect(() => {
    if (!user) return;

    const fetchMedia = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("media_list")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching media list:", error.message);
      } else if (data) {
        const watchlist = data.filter((item) => item.status === "watchlist");
        const watched = data.filter((item) => item.status === "watched");

        dispatch({ type: "SET_WATCHLIST", payload: watchlist });
        dispatch({ type: "SET_WATCHED", payload: watched });
      }

      setLoading(false);
    };

    fetchMedia();
  }, [user]);

  // ---- LOAD PROFILE ----
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("username, preferences")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        dispatch({ type: "SET_PROFILE", payload: data });
      }
    };

    fetchProfile();
  }, [user]);

  // ---- ACTIONS ----
  const addMovieToWatchlist = async (movie) => {
    if (!user) return;

    const { error } = await supabase.from("media_list").upsert(
      {
        user_id: user.id,
        media_id: movie.id.toString(),
        title: movie.title || movie.name || movie.volumeInfo?.title,
        type: movie.type,
        status: "watchlist",
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : movie.volumeInfo?.imageLinks?.thumbnail ||
            movie.background_image ||
            null,
      },
      { onConflict: ["user_id", "media_id"] }
    );

    if (error) {
      console.error("Error adding to watchlist:", error.message);
    } else {
      dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
    }
  };

  const addMovieToWatched = async (movie) => {
    if (!user) return;

    const { error } = await supabase.from("media_list").upsert(
      {
        user_id: user.id,
        media_id: movie.id.toString(),
        title: movie.title || movie.name || movie.volumeInfo?.title,
        type: movie.type,
        status: "watched",
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : movie.volumeInfo?.imageLinks?.thumbnail ||
            movie.background_image ||
            null,
      },
      { onConflict: ["user_id", "media_id"] }
    );

    if (error) {
      console.error("Error adding to watched:", error.message);
    } else {
      dispatch({ type: "ADD_TO_WATCHED", payload: movie });
    }
  };

  const moveToWatchlist = async (movie) => {
    if (!user) return;

    const { error } = await supabase.from("media_list").upsert(
      {
        user_id: user.id,
        media_id: movie.id.toString(),
        title: movie.title || movie.name || movie.volumeInfo?.title,
        type: movie.type,
        status: "watchlist",
        poster_url: movie.poster_url || null,
      },
      { onConflict: ["user_id", "media_id"] }
    );

    if (error) {
      console.error("Error moving to watchlist:", error.message);
    } else {
      dispatch({ type: "MOVE_TO_WATCHLIST", payload: movie });
    }
  };

  const removeMovieFromWatchlist = async (id) => {
    if (!user) return;

    const { error } = await supabase
      .from("media_list")
      .delete()
      .eq("user_id", user.id)
      .eq("media_id", id);

    if (error) {
      console.error("Error removing from watchlist:", error.message);
    } else {
      dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: id });
    }
  };

  const removeMovieFromWatched = async (id) => {
    if (!user) return;

    const { error } = await supabase
      .from("media_list")
      .delete()
      .eq("user_id", user.id)
      .eq("media_id", id);

    if (error) {
      console.error("Error removing from watched:", error.message);
    } else {
      dispatch({ type: "REMOVE_FROM_WATCHED", payload: id });
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        watchlist: state.watchlist,
        watched: state.watched,
        profile: state.profile, // <-- pass profile here
        addMovieToWatchlist,
        addMovieToWatched,
        moveToWatchlist,
        removeMovieFromWatchlist,
        removeMovieFromWatched,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
