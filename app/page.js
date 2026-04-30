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
    <div style={{ background: "#000", color: "#fff", padding: "10px" }}>
      
      <h1>Asupanmu</h1>

      {/* IKLAN */}
      <a
        href="https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1"
        target="_blank"
      >
        🔥 Tonton Video Premium
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
          <Link key={i} href={v.url}>
            <div style={{ cursor: "pointer" }}>
              <img
                src={v.thumbnail}
                style={{
                  width: "100%",
                  borderRadius: "10px"
                }}
              />
              <p>{v.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
