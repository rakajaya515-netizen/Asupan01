"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setSelectedVideo(data[0]); // auto play pertama
      });
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", padding: "10px" }}>
      
      <h1>Asupanmu</h1>

      {/* PLAYER */}
      {selectedVideo && (
        <div style={{ marginBottom: "10px" }}>
          <iframe
            src={selectedVideo.url}
            width="100%"
            height="220"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      {/* IKLAN */}
      <a href="https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1">
        Tonton Video Premium 🔥
      </a>

      {/* GRID 2 KOLOM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "10px"
        }}
      >
        {videos.map((v, i) => (
          <div
            key={i}
            onClick={() => setSelectedVideo(v)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={v.thumbnail}
              style={{
                width: "100%",
                borderRadius: "10px"
              }}
            />
            <p>{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}              
