import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        setVideos(data.result?.videos || []);
      });
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "#000",
        padding: "15px",
        zIndex: 100
      }}>
        <h2 style={{ margin: 0 }}>Asupanmu</h2>

        <input
          placeholder="Search video..."
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            borderRadius: "20px",
            border: "none",
            background: "#111",
            color: "#fff"
          }}
        />
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        padding: "12px"
      }}>
        {videos.map((v, i) => (
          <a
            key={i}
            href={`/watch?code=${v.filecode}`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden"
            }}>
              <img
                src={v.thumbnail}
                alt={v.title}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover"
                }}
              />

              <div style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.9))"
              }}>
                {v.title}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
