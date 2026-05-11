"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        console.log(data);

        if (Array.isArray(data)) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadVideos();
  }, []);

  const filtered = videos.filter((video) =>
    video.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <h1 className="logo">Asupanmu</h1>

      <input
        type="text"
        placeholder="Search video..."
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="count">
        {filtered.length} videos loaded
      </p>

      <div className="grid">
        {filtered.map((video) => (
          <a
            key={video.id}
            href={`https://videy.co/v/?id=${video.id}`}
            target="_blank"
            className="card"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumb"
            />

            <div className="info">
              <p>{video.title}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
