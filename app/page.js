import Link from "next/link";

async function getVideos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <main style={{ padding: 20 }}>
      <h1>Asupanmu</h1>

      <div className="grid">
        {videos.map((v, i) => (
          <Link key={i} href={v.url} className="card">
            <img src={v.thumbnail} />
            <p>{v.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
