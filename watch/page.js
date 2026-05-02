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

  if (!id) {
    return (
      <h1 style={{ color: "white", background: "#000", height: "100vh" }}>
        ID tidak ada
      </h1>
    );
  }

  return (
    <div style={{
      background: "#000",
      height: "100vh"
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
