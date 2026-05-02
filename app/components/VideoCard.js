"use client";

import Link from "next/link";

export default function VideoCard({ video }) {
  return (
    <Link href={`/watch/${video.source}/${video.id}`}>
      <div className="card">
        <img src={video.thumbnail} alt={video.title} />
      </div>
    </Link>
  );
}
