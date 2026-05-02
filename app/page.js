"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 16 }}>
      
      <h1 style={{ color: "white", fontSize: 32 }}>
        Asupanmu
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10
      }}>
        
        {videos.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              window.location.href = `/watch?source=dood&id=${v.id}`;
            }}
            style={{
              cursor: "pointer",
              background: "#111",
              borderRadius: 8,
              overflow: "hidden"
            }}
          >
            
            <div style={{
              width: "100%",
              aspectRatio: "1/1"
            }}>
              <img
                src={v.thumbnail}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            <p style={{
              color: "white",
              fontSize: 12,
              padding: 6
            }}>
              {v.title}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
