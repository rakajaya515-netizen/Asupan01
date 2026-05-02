"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div style={{ padding: 16, background: "black", minHeight: "100vh" }}>
      <h1 style={{ color: "white" }}>Asupanmu</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        {videos.map((v, i) => (
          <a key={i} href={v.url} style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "9/16",
                overflow: "hidden",
                borderRadius: 8,
              }}
            >
              <img
                src={v.thumbnail}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <p
              style={{
                color: "white",
                fontSize: 14,
                marginTop: 5,
              }}
            >
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
