"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "10px", background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff" }}>Asupanmu</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "20px",
          margin: "10px 0"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px"
        }}
      >
        {filtered.map((v, i) => (
          <a
            key={i}
            href={v.video_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "white" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden"
              }}
            >
              <img
                src={v.thumbnail}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  padding: "10px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                }}
              >
                <p style={{ fontSize: "13px" }}>{v.title}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
