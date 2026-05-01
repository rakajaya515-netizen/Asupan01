"use client";

import { useSearchParams } from "next/navigation";

export default function Player() {
  const params = useSearchParams();
  const id = params.get("id");
  const source = params.get("source");

  if (!id) return <p>Loading...</p>;

  let videoUrl = "";

  // ===== VIDARA =====
  if (source === "vidara") {
    const filecode = id.split("/").pop();
    videoUrl = `https://vidara.so/embed-${filecode}.html`;
  }

  // ===== DOOD =====
  if (source === "doodstream") {
    videoUrl = id;
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <iframe
        src={videoUrl}
        width="100%"
        height="400"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  );
}
