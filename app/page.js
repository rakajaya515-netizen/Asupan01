"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVideos(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = videos.filter((video) =>
    video.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-5xl font-bold text-pink-500 mb-6">
        Asupanmu
      </h1>

      <input
        type="text"
        placeholder="Search video..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-2xl bg-zinc-900 mb-6 text-white"
      />

      <p className="mb-6 text-xl">
        {filtered.length} videos loaded
      </p>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((video) => (
          <a
            key={video.id}
            href={`https://videy.co/v/?id=${video.id}`}
            target="_blank"
            className="bg-zinc-900 rounded-2xl overflow-hidden"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-2">
              <p className="text-sm line-clamp-2">
                {video.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
