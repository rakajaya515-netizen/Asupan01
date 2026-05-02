"use client";

import Link from "next/link";

export default function VideoCard({ video }) {
  return (
    <Link href={`/watch?id=${video.id}&source=${video.source}`}>
      <div className="card">
        <img src={video.thumbnail} alt={video.title} />
      </div>

      <style jsx>{`
        .card {
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }
      `}</style>
    </Link>
  );
}
