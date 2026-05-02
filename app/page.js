"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div style={{ padding: 16, background: "#000", minHeight: "100vh" }}>
      
      <h1 style={{ color: "white", fontSize: 32, marginBottom: 20 }}>
        Asupanmu
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10
      }}>
        
        {videos.map((v, i) => (
          <Link key={i} href={`/watch?source=dood&id=${v.id}`}>
            
            <div style={{
              cursor: "pointer",
              background: "#111",
              borderRadius: 8,
              overflow: "hidden"
            }}>
              
              <div style={{
                width: "100%",
                aspectRatio: "1/1", // 🔥 bikin semua kotak sama
                overflow: "hidden"
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

          </Link>
        ))}

      </div>
    </div>
  );
}
