"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <main style={{ padding: 10, background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff" }}>Asupanmu</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {videos.map((v, i) => (
          <Link
            key={i}
            href={`/player?id=${encodeURIComponent(v.url)}&source=${v.source}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#111",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <img
                src={v.thumbnail}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <p style={{ color: "#fff", padding: 5 }}>
                {v.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
