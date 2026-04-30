   "use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then(setVideos);
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="title">Asupanmu</div>

        <div className="search">
          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {filtered.map((v, i) => (
          <a
            href={v.video_url}
            target="_blank"
            key={i}
            className="card"
          >
            <img src={v.thumbnail} alt="" />

            <div className="overlay">
              {v.title}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}             
