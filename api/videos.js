export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      title: "Test Video 1",
      thumbnail: "https://picsum.photos/300/400?1",
      url: "https://example.com"
    },
    {
      id: 2,
      title: "Test Video 2",
      thumbnail: "https://picsum.photos/300/400?2",
      url: "https://example.com"
    }
  ]);
}
