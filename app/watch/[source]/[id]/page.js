"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Watch() {
  const params = useSearchParams();
  const source = params.get("source");
  const id = params.get("id");

  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/player?source=${source}&id=${id}`)
      .then(res => res.json())
      .then(data => setUrl(data.url));
  }, [id, source]);

  return (
    <div className="player">
      {!url ? (
        <p>Loading...</p>
      ) : (
        <iframe
          src={url}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}
