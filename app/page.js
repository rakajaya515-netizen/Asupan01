"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(null);

  // AUTO LOAD VIDEO TERBARU
  useEffect(() => {
    loadVideos();

    // auto refresh tiap 30 detik
    const interval = setInterval(() => {
      loadVideos();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadVideos = async () => {
    const res = await fetch("/api/videos");
    const data = await res.json();
    setVideos(data);
  };

  return (
    <main className="bg-black min-h-screen text-white p-3">
      <h1 className="text-3xl font-bold mb-4">Asupanmu</h1>

      {/* PLAYER */}
      {active && (
        <div className="mb-4">
          <iframe
            src={active}
            className="w-full h-64 rounded-xl"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* ADS BUTTON */}
      <div className="mb-4 text-center">
        <a
          href="https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1"
          target="_blank"
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Tonton Video Premium 🔥
        </a>
      </div>

      {/* GRID 2 KOLOM (PASTI 2) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // PAKSA 2 KOLOM
          gap: "10px",
        }}
      >
        {videos.map((v, i) => (
          <div key={i} onClick={() => setActive(v.url)}>
            <img
              src={v.thumbnail}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <p style={{ fontSize: "12px", marginTop: "5px" }}>
              {v.title}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
