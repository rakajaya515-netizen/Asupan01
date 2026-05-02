"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(setVideos);
  }, []);

  return (
    <main style={{ padding: 16, background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "white" }}>Asupanmu</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
        gap: 10
      }}>
        {videos.map(v => (
          <Link
            key={v.id}
            href={`/watch?id=${v.id}&src=${v.source}`}
            style={{ textDecoration: "none" }}
          >
            <div>
              <div style={{
                width: "100%",
                aspectRatio: "1/1",
                overflow: "hidden",
                borderRadius: 8
              }}>
                <img
                  src={v.thumbnail}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              <p style={{
                color: "white",
                fontSize: 12,
                marginTop: 5
              }}>
                {v.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
