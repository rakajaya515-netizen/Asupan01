   "use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 LINK MONETISASI
  const AD_LINK =
    "https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1";

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data || []));
  }, []);

  const filtered = videos.filter((v) =>
    (v.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#0b0b0b",
        minHeight: "100vh",
        color: "#fff"
      }}
    >
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

      {/* GRID 2 KOLOM FIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 🔥 FIX 2 KOLOM
          gap: "12px",
          padding: "12px"
        }}
      >
        {filtered.map((v, i) => (
          <div
            key={i}
            onClick={() => {
              // buka iklan dulu
              window.open(AD_LINK, "_blank");

              // lanjut ke video
              setTimeout(() => {
                window.location.href = v.video_url;
              }, 800);
            }}
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              background: "#111"
            }}
          >
            {/* THUMBNAIL */}
            <img
              src={v.thumbnail || "https://via.placeholder.com/300x200"}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover"
              }}
            />

            {/* TITLE OVERLAY */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "10px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              {v.title || "No Title"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                      }
