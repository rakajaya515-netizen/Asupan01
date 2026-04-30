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
    async function load() {
      if (source === "vidara") {
        const res = await fetch(
          `/api/player?source=vidara&id=${id}`
        );
        const data = await res.json();
        setVideoUrl(data.url);
        setTitle(data.title);
      }

      if (source === "dood") {
        setVideoUrl(`https://dood.so/e/${id}`);
      }
    }

    load();
  }, [source, id]);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      
      <h2 style={{ padding: "10px" }}>{title}</h2>

      {/* PLAYER BERSIH */}
      <video
        src={videoUrl}
        controls
        autoPlay
        style={{
          width: "100%",
          maxHeight: "400px",
          background: "#000"
        }}
      />

      {/* IKLAN */}
      <div style={{ padding: "10px" }}>
        <a href="https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1">
          🔥 Tonton Video Premium
        </a>
      </div>

    </div>
  );
}
