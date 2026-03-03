/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useEffect, useState } from "react";
import "./App.css";
import girl from "./girl.gif";

// 🔥 IMPORTANT: your REAL backend URL
const API_URL = "https://happytime-backend.onrender.com";

export default function App() {
  const [status, setStatus] = useState("booting...");
  const [videos, setVideos] = useState([]);

  // ✅ CHECK BACKEND STATUS
  const checkServer = async () => {
    try {
      const res = await fetch(API_URL + "/api/status");
      const data = await res.json();

      console.log("SERVER:", data);

      if (data.status === "online") {
        setStatus("🟢 ONLINE");
      } else {
        setStatus("🔴 OFFLINE");
      }
    } catch (err) {
      console.error("ERROR:", err);
      setStatus("🔴 OFFLINE");
    }
  };

  // ✅ FETCH VIDEOS
  const fetchVideos = async () => {
    try {
      const res = await fetch(API_URL + "/videos");
      const data = await res.json();

      if (Array.isArray(data)) {
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkServer();
    fetchVideos();
  }, []);

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${girl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "250px",
      }}
    >
      <h1 className="glitch">happytimextreme.exe</h1>

      <marquee className="marquee">WELCOME TO HAPPYTIME XTREME</marquee>
      <marquee className="marquee2">UNCENSORED CONTENT</marquee>

      <h2>Status: {status}</h2>

      {/* 🎥 VIDEOS */}
      <div className="video-area">
        {videos.map((vid, i) => (
          <div key={i} className="video-card">
            <h3>{vid.title}</h3>

            {vid.url.includes("youtube") ? (
              <iframe
                width="300"
                height="200"
                src={vid.url.replace("watch?v=", "embed/")}
                title="video"
              />
            ) : (
              <video width="300" controls>
                <source src={vid.url} />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
