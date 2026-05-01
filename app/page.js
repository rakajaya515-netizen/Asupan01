import Link from "next/link";

export const dynamic = "force-dynamic";

async function getVideos() {
  const res = await fetch("https://asupan01.vercel.app/api/videos", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className="container">
      <h1 className="title">Asupanmu</h1>

      <div className="grid">
        {videos.map((v, i) => (
          <Link
            key={i}
            href={`/watch/${v.source}/${v.id}`}
            className="card"
          >
            <img src={v.thumbnail} />
            <p>{v.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
