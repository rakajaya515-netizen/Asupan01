"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
  const params = useSearchParams();
  const id = params.get("id");
  const src = params.get("src");

  let videoUrl = "";

  if (src === "dood") {
    videoUrl = `https://doodstream.com/e/${id}`;
  }

  if (src === "vidara") {
    videoUrl = `https://vidara.so/${id}`;
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 16 }}>
      <iframe
        src={videoUrl}
        width="100%"
        height="500"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  );
}
