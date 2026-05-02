"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Watch() {
  const params = useSearchParams();
  const source = params.get("source");
  const id = params.get("id");

  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!id || !source) return;

    fetch(`/api/player?source=${source}&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          setUrl("error");
        }
      })
      .catch(() => setUrl("error"));
  }, [id, source]);

  if (!id || !source) {
    return <p style={{ color: "white" }}>Video tidak valid</p>;
  }

  return (
    <div style={{ padding: 10 }}>
      {!url && <p style={{ color: "white" }}>Loading...</p>}

      {url === "error" && (
        <p style={{ color: "red" }}>Gagal load video</p>
      )}

      {url && url !== "error" && (
        <iframe
          src={url}
          width="100%"
          height="500"
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="lazy"
          style={{ border: "none" }}
        />
      )}
    </div>
  );
}
