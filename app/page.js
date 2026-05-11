// app/page.js

"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");

        const data = await res.json();

        setVideos(data);
        setFiltered(data);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }

    loadVideos();
  }, []);

  function handleSearch(value) {
    setSearch(value);

    const result = videos.filter((video) =>
      video.title?.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(result);
  }

  return (
    <main className="main">
      <div className="navbar">
        <h1 className="logo">Asupanmu</h1>

        <input
          type="text"
          placeholder="Search video..."
          className="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <p className="count">
        {loading
          ? "Loading videos..."
          : `${filtered.length} videos loaded`}
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
              loading="lazy"
            />

            <div className="overlay">
              <div className="play">▶</div>
            </div>

            <div className="info">
              <h2>{video.title}</h2>

              <div className="meta">
                <span>{video.views || 0} views</span>
                <span>{video.duration || 0}s</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
