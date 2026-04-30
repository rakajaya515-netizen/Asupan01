"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        console.log("VIDEOS:", data);
        setVideos(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      
      {/* NAVBAR */}
      <div style={{ padding: "16px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>
          Asupanmu
        </h1>

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            borderRadius: "20px",
            border: "none",
            background: "#1a1a1a",
            color: "#fff",
          }}
        />
      </div>

      {/* GRID 2 KOLOM FIX */}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "12px",
        }}
      >
        {filtered.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              window.open(v.video_url, "_blank");
            }}
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              background: "#111",
            }}
          >
            <img
              src={v.thumbnail || "https://via.placeholder.com/300x200"}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            {/* TITLE */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "10px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
            }
