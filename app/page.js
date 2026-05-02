import { fetchVideos } from "@/lib/fetchVideos";
import VideoCard from "@/components/VideoCard";

export const metadata = {
  title: "Asupanmu - Video Streaming",
  description: "Streaming video terbaru",
};

export default async function Home() {
  const videos = await fetchVideos();

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Asupanmu
      </h1>

      <div className="grid">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }
      `}</style>
    </main>
  );
}
