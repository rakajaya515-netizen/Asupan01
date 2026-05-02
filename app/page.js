import { getVideos } from "@/lib/fetchVideos";
import VideoCard from "@/components/VideoCard";

export const revalidate = 60;

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className="container">
      <h1>Asupanmu</h1>

      <div className="grid">
        {videos.map((video, i) => (
          <VideoCard key={i} video={video} />
        ))}
      </div>
    </main>
  );
}
