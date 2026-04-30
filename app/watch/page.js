"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Watch() {
  const params = useSearchParams();
  const source = params.get("source");
  const id = params.get("id");

  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`/api/player?source=${source}&id=${id}`)
      .then(res => res.json())
      .then(data => {
        setVideoUrl(data.url);
        setTitle(data.title);
      });
  }, [source, id]);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      
      <button onClick={() => history.back()}>
        ⬅ Kembali
      </button>

      <h2 style={{ padding: "10px" }}>{title}</h2>

      {/* PLAYER */}
      <div>
        <iframe
          src={videoUrl}
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
        />
      </div>

      {/* IKLAN */}
      <div style={{ padding: "10px" }}>
        <a
          href="https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1"
          target="_blank"
        >
          🔥 Tonton Video Premium
        </a>
      </div>
    </div>
  );
}
