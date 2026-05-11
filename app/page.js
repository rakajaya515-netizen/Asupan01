"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        const videosWithUrl = await Promise.all(
          data.map(async (video) => {
            try {
              const detail = await fetch(
                `https://vizey.net/api/v1/videos?apikey=${process.env.NEXT_PUBLIC_VIZEY_API_KEY}&id=${video.id}`
              );

              const detailData = await detail.json();

              return {
                ...video,
                url: detailData?.data?.url || "#",
              };
            } catch {
              return {
                ...video,
                url: "#",
              };
            }
          })
        );

        setVideos(videosWithUrl);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
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
        {loading
          ? "Loading videos..."
          : `${filtered.length} videos loaded`}
      </p>

      <div className="grid">
        {filtered.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            className="card"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumb"
              loading="lazy"
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
