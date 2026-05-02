import Link from "next/link";

async function getVideos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`, {
      cache: "no-store",
    });

    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <main style={{ padding: 10 }}>
      <h1>Asupanmu</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "10px"
      }}>
        {videos.map((v, i) => (
          <Link key={i} href={v.url}>
            <div>
              <img src={v.thumbnail} width="100%" />
              <p>{v.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
