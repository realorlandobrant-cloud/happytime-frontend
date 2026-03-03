/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useEffect, useState } from "react";
import "./App.css";
import girl from "./girl.gif";

// ✅ FIXED API URL
const API_URL = "https://happytime-backend.onrender.com/videos";

const ADMIN_KEY = "dothextremeworm";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("booting...");
  const [musicOn, setMusicOn] = useState(false);

  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(2);

  const [adminMode, setAdminMode] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [dragActive, setDragActive] = useState(false);

  // ✅ FETCH VIDEOS
  const fetchVideos = async () => {
    try {
      setStatus("CONNECTING...");
      const res = await fetch(API_URL);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setVideos([]);
        setStatus("NO DATA");
        return;
      }

      setVideos(data);
      setStatus("CONNECTED ✔");
    } catch (err) {
      console.error(err);
      setStatus("OFFLINE");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🎬 DVD bounce
  useEffect(() => {
    const interval = setInterval(() => {
      setX((prevX) => {
        let newX = prevX + dx;

        if (newX <= 0) {
          setDx((d) => Math.abs(d));
          return 0;
        }

        if (newX >= window.innerWidth - 100) {
          setDx((d) => -Math.abs(d));
          return window.innerWidth - 100;
        }

        return newX;
      });

      setY((prevY) => {
        let newY = prevY + dy;

        if (newY <= 0) {
          setDy((d) => Math.abs(d));
          return 0;
        }

        if (newY >= window.innerHeight - 100) {
          setDy((d) => -Math.abs(d));
          return window.innerHeight - 100;
        }

        return newY;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [dx, dy]);

  // 🎵 music
  useEffect(() => {
    const audio = document.getElementById("bg-music");
    if (!audio) return;

    if (musicOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [musicOn]);

  // 🔐 unlock admin
  const unlockAdmin = () => {
    if (keyInput === ADMIN_KEY) {
      setAdminMode(true);
    } else {
      alert("wrong key");
    }
  };

  // ⬆ upload via URL
  const uploadVideo = async () => {
    if (!title || !url) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url }),
    });

    setTitle("");
    setUrl("");
    fetchVideos();
  };

  // 🟡 DRAG + DROP UPLOAD
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    await fetch(API_URL + "/upload", {
      method: "POST",
      body: formData,
    });

    fetchVideos();
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${girl})`,
        backgroundRepeat: "repeat",
        backgroundSize: "250px",
      }}
    >
      <audio id="bg-music" src="/Ayylien_rough_mix_KLICKAUD.mp3" loop />

      <h1 className="glitch">happytimextreme.exe</h1>

      <marquee className="marquee">WELCOME TO HAPPYTIME XTREME</marquee>
      <marquee className="marquee2">UNCENSORED CONTENT</marquee>

      <button onClick={() => setMusicOn((m) => !m)}>
        {musicOn ? "MUSIC OFF" : "MUSIC ON"}
      </button>

      <p>Status: {status}</p>

      {/* 🔐 ADMIN */}
      {!adminMode && (
        <div className="admin">
          <input
            placeholder="enter key..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button onClick={unlockAdmin}>unlock</button>
        </div>
      )}

      {adminMode && (
        <div className="admin-panel">
          <input
            placeholder="video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="video url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={uploadVideo}>UPLOAD</button>

          <div
            className={`drop-zone ${dragActive ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            DRAG & DROP VIDEO HERE
          </div>
        </div>
      )}

      {/* 🎥 VIDEO AREA */}
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

      {/* 😀 DVD FACE */}
      <div className="dvd" style={{ left: x, top: y }}>
        <div className="face">
          <div className="eye left"></div>
          <div className="eye right"></div>
          <div className="mouth"></div>
        </div>
      </div>
    </div>
  );
}
