"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Watch() {
  const params = useSearchParams();
  const source = params.get("source");
  const id = params.get("id");

  const [url, setUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!source || !id) {
      setError("Video tidak valid");
      return;
    }

    fetch(`/api/player?source=${source}&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setUrl(data.url);
        } else {
          setError("Gagal load video");
        }
      })
      .catch(() => setError("Server error"));
  }, [source, id]);

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 10 }}>
      {!url ? (
        <p>Loading...</p>
      ) : (
        <iframe
          src={url}
          width="100%"
          height="500"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{ border: "none" }}
        />
      )}
    </div>
  );
}
