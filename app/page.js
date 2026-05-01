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

      <div className="grid">
        {videos.map((v, i) => (
          <Link
            key={i}
            href={`/player?id=${encodeURIComponent(v.url)}&source=${v.source}`}
            className="card"
          >
            <img src={v.thumbnail} />
            <p>{v.title}</p>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .card {
          background: #111;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
        }

        .card img {
          width: 100%;
          aspect-ratio: 9/12;
          object-fit: cover;
        }

        .card p {
          color: white;
          font-size: 14px;
          padding: 6px;
        }
      `}</style>
    </main>
  );
}
