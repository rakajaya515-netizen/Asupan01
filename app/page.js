   "use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 LINK MONETISASI KAMU
  const AD_LINK = "https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1";

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#0b0b0b", minHeight: "100vh", color: "#fff" }}>
      
      {/* NAVBAR */}
      <div style={{ padding: "15px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
          Asupanmu
        </h1>

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            borderRadius: "20px",
            border: "none",
            background: "#1a1a1a",
            color: "#fff"
          }}
        />
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "12px"
        }}
      >
        {filtered.map((v, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer"
            }}
            onClick={() => {
              // 🔥 buka iklan dulu
              window.open(AD_LINK, "_blank");

              // 🔥 lalu buka video asli
              setTimeout(() => {
                window.location.href = v.video_url;
              }, 800);
            }}
          >
            <img
              src={v.thumbnail}
              style={{
                width: "100%",
                height: "230px",
                objectFit: "cover"
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "10px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
