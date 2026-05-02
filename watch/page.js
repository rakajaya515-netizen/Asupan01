"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
  const params = useSearchParams();

  const id = params.get("id");
  const source = params.get("source");

  let url = "";

  if (source === "dood") {
    url = `https://doodstream.com/e/${id}`;
  }

  if (!url) {
    return <h1 style={{ color: "white" }}>Video tidak ditemukan</h1>;
  }

  return (
    <div style={{
      background: "#000",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <iframe
        src={url}
        width="100%"
        height="100%"
        allowFullScreen
        style={{ border: "none" }}
      />

    </div>
  );
}
