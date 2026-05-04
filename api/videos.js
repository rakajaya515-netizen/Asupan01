export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  res.status(200).json([
    {
      id: 1,
      title: "Test Video 1",
      thumbnail: "https://picsum.photos/400/600?1",
      url: "https://example.com"
    },
    {
      id: 2,
      title: "Test Video 2",
      thumbnail: "https://picsum.photos/400/600?2",
      url: "https://example.com"
    }
  ]);
}
