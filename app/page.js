import Link from "next/link";

async function getVideos() {
  const res = await fetch("/api/videos", { cache: "no-store" });
  return res.json();
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <main style={{ padding: 10 }}>
      <h1>Asupanmu</h1>

      <div className="grid">
        {videos.map((v, i) => (
          <Link key={i} href={v.link} className="card">
            <div className="thumb">
              <img src={v.thumbnail} />
            </div>
            <p>{v.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
