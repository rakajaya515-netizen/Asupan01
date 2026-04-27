export default function handler(req, res) {
  res.status(200).json({
    videos: [
      {
        title: "Video 1",
        thumbnail: "https://via.placeholder.com/300",
        filecode: "abc123"
      },
      {
        title: "Video 2",
        thumbnail: "https://via.placeholder.com/300",
        filecode: "xyz456"
      }
    ]
  });
}
