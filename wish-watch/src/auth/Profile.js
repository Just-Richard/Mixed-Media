import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [preferences, setPreferences] = useState([]);
  const allPrefs = [
    "anime",
    "tv",
    "games",
    "books",
    "music",
    "cartoons",
    "movies",
  ];

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const fetchProfile = async (id) => {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();
    if (data) {
      setUsername(data.username || "");
      setPreferences(data.preferences || []);
    }
  };

  const togglePreference = (pref) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const updateProfile = async () => {
    await supabase
      .from("users")
      .update({ username, preferences })
      .eq("id", user.id);
    alert("Profile updated");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Email: {user?.email}</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <div>
        {allPrefs.map((p) => (
          <label key={p}>
            <input
              type="checkbox"
              checked={preferences.includes(p)}
              onChange={() => togglePreference(p)}
            />
            {p}
          </label>
        ))}
      </div>
      <button onClick={updateProfile}>Save</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
