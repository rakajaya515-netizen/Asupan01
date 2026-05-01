"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Player() {
  const params = useSearchParams();
  const id = params.get("id");
  const source = params.get("source");

  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/player?id=${encodeURIComponent(id)}&source=${source}`)
      .then((res) => res.json())
      .then((data) => setVideo(data));
  }, [id]);

  if (!video) return <p style={{ color: "#fff" }}>Loading...</p>;

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 10 }}>
      <h2 style={{ color: "#fff" }}>{video.title}</h2>

      <iframe
        src={video.url}
        width="100%"
        height="300"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  );
}
