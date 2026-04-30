"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        console.log("VIDEOS:", data);
        setVideos(data);
      });
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Asupanmu</h1>

      {videos.length === 0 && <p>Tidak ada video</p>}

      <div style={{ display: "grid", gap: 20 }}>
        {videos.map((v, i) => (
          <div key={i}>
            <h3>{v.title}</h3>
            <iframe
              src={v.url}
              width="100%"
              height="200"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </main>
  );
}
