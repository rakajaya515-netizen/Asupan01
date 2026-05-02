"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div style={{ background: "black", minHeight: "100vh", padding: 10 }}>
      <iframe
        src={`https://doodstream.com/e/${id}`}
        width="100%"
        height="400"
        allowFullScreen
      />
    </div>
  );
}
