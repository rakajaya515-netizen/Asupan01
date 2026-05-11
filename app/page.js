"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (Array.isArray(data)) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filtered = videos.filter((v) =>
    v.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="logo">Asupanmu</h1>

      <input
        className="search"
        placeholder="Search video..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="count">{filtered.length} videos loaded</p>

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
              className="thumb"
            />

            <div className="info">
              <p>{video.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
