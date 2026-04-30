export default function handler(req, res) {
  res.status(200).json([
    {
      title: "Video OK",
      thumbnail: "https://picsum.photos/300/200",
      video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ]);
}
