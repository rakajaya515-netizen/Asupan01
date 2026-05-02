"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setVideos(data);
      });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ color: "white" }}>Asupanmu</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10
      }}>
        {videos.map((v, i) => (
          <div key={i}>
            <img src={v.thumbnail} style={{ width: "100%" }} />
            <p style={{ color: "white" }}>{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
