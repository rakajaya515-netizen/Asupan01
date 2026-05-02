export async function getVideos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos`, {
    cache: "no-store"
  });

  return res.json();
}
