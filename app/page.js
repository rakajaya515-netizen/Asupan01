"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      
      {/* NAVBAR */}
      <div style={{ padding: "15px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700" }}>
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
            color: "#fff"
          }}
        />
      </div>

      {/* GRID 2 KOLOM FIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 🔥 FIX 2 KOLOM
          gap: "12px",
          padding: "12px"
        }}
      >
        {filtered.map((v, i) => (
          <div
            key={i}
            onClick={() => window.open(v.video_url, "_blank")}
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#111",
              cursor: "pointer"
            }}
          >
            {/* THUMB */}
            <img
              src={v.thumbnail || "https://via.placeholder.com/300"}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover"
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
                  "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                color: "#fff", // 🔥 PUTIH
                fontSize: "13px",
                fontWeight: "600"
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
