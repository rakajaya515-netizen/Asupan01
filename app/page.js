"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", background: "#000", color: "#fff" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        Asupanmu01
      </h1>

      <input
        type="text"
        placeholder="Search video..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "none"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px"
        }}
      >
        {filtered.map((v, i) => (
          <div key={i}>
            <img
              src={v.thumbnail}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <p>{v.title}</p>

            <iframe
              src={v.video_url}
              width="100%"
              height="200"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}
