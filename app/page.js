"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <main className="bg-black min-h-screen text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Asupanmu</h1>

      {/* PLAYER */}
      {active && (
        <div className="mb-6">
          <iframe
            src={active}
            className="w-full h-64 rounded-xl"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* GRID 2 KOLOM */}
      <div className="grid grid-cols-2 gap-3">
        {videos.map((v, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => setActive(v.url)}
          >
            <img
              src={v.thumbnail}
              className="rounded-lg w-full h-40 object-cover"
            />
            <p className="text-sm mt-1 line-clamp-2">{v.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
