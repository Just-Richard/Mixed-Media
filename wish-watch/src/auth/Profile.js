import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const allPrefs = [
    "Movies",
    "Anime",
    "Books",
    "Cartoons",
    "Music",
    "TV Shows",
    "Video Games",
  ];

  const togglePreference = (type) => {
    setPreferences((prev) =>
      prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);

      await supabase.from("users").upsert(
        [
          {
            id: user.id,
            email: user.email || null,
            username: username || "",
            preferences: preferences || [],
          },
        ],
        { onConflict: ["id"] }
      );

      const { data, error } = await supabase
        .from("users")
        .select("username, preferences")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error.message);
      } else if (data) {
        setUsername(data.username || "");
        setPreferences(data.preferences || []);
      }
    };

    loadProfile();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      console.error("No logged-in user, cannot save profile");
      return;
    }

    const trimUsername = username.trim();

    console.log("Saving profile with:", { trimUsername, preferences });

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      username: username.trim(),
      preferences: preferences,
    });

    if (error) {
      console.error("Error Saving Profile:", error.message);
      alert(`Error Saving Profile: ${error.message}`);
    } else {
      alert("Profile Saved Successfully!");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Delete your account? This cannot be undone.")) return;

    // Get access token
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    const endpoint =
      "https://yuxfbygkdiovzjaouqcd.supabase.co/functions/v1/delete-user";

    try {
      console.log("Sending Authorization:", `Bearer ${accessToken}`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const json = await res.json();

      if (json?.success) {
        alert("Profile deleted successfully.");
        await supabase.auth.signOut();
        navigate("/login");
      } else {
        alert("Error deleting profile: " + (json?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete request failed:", err);
      alert(
        "Failed to contact delete-user function. Check endpoint or CORS settings."
      );
    }
  };

  if (!user) {
    console.error("No User Logged in.");
    return;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Update Profile</h1>
        </div>
        {loading ? (
          <p style={{ fontWeight: "bold", fontSize: "1.6rem" }}>
            Loading Profile...
          </p>
        ) : (
          <>
            <p style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
              Your E-Mail Address: {user?.email}
            </p>
            <div className="input-wrapper">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Your New Username"
              />
            </div>
            <br /> <br /> <br /> <br />
            <p style={{ fontWeight: "bold", fontSize: "2rem" }}>
              Choose Your Media Preferences:
            </p>
            <div>
              {allPrefs.map((type) => (
                <label key={type} className="new-checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.includes(type)}
                    onChange={() => togglePreference(type)}
                    className="new-checkbox"
                  />
                  {type}
                </label>
              ))}
            </div>
            <br /> <br />
            <button onClick={handleSave} className="btn">
              Save
            </button>{" "}
            &nbsp; &nbsp; &nbsp; &nbsp;
            <button onClick={handleLogout} className="btn">
              Logout
            </button>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <button onClick={handleDelete} className="btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
