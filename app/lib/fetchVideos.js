export async function fetchVideos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`, {
    next: { revalidate: 60 }
  });

  return res.json();
}
