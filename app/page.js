"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div style={{ padding: 20, background: "#000", color: "#fff" }}>
      <h1>Asupanmu</h1>

      {/* PLAYER */}
      {selected && (
        <div style={{ marginBottom: 20 }}>
          <iframe
            src={selected.video_url}
            width="100%"
            height="250"
            allowFullScreen
          />
          <h3>{selected.title}</h3>
        </div>
      )}

      {/* GRID VIDEO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {videos.map((v, i) => (
          <div
            key={i}
            onClick={() => setSelected(v)}
            style={{
              cursor: "pointer",
              background: "#111",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <img
              src={v.thumbnail}
              style={{ width: "100%", borderRadius: 10 }}
            />
            <p style={{ fontSize: 12 }}>{v.title}</p>
            <small>{v.source}</small>
          </div>
        ))}
      </div>
    </div>
  );
            }
