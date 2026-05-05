import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 12 }}>
      {/* HEADER */}
      <h1 style={{ color: "white", marginBottom: 10 }}>Asupanmu</h1>

      <input
        placeholder="Search video..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 20,
          border: "none",
          marginBottom: 15,
          background: "#111",
          color: "white"
        }}
      />

      {/* GRID */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // FIX 2 kolom
    gap: 14
  }}
>
        {videos.map((v, i) => {
          const title = v.title || v.name || "No title";
          const thumb =
            v.thumbnail || v.thumb || v.image || "https://via.placeholder.com/300";
          const link = v.url || v.link || "#";

          return (
            <a
  key={i}
  href={link}
  target="_blank"
  style={{ textDecoration: "none" }}
>
  <div
    style={{
      position: "relative",
      borderRadius: 18,
      overflow: "hidden",
      height: 260, // 👉 tinggi portrait (penting!)
      background: "#111"
    }}
  >
    {/* IMAGE */}
    <img
      src={thumb}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />

    {/* OVERLAY */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2), transparent)"
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "600",
          lineHeight: "18px"
        }}
      >
        {title}
      </div>
    </div>
  </div>
</a>
