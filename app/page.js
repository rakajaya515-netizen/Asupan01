"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then(setVideos);
  }, []);

  return (
    <div>
      <h1>Asupanmu</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {videos.map((v, i) => (
          <div key={i}>
            <img src={v.thumbnail} width="100%" />
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
