export default function handler(req, res) {
  res.status(200).json([
    {
      title: "Sample Video 1",
      thumbnail: "https://picsum.photos/300/200",
      video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      title: "Sample Video 2",
      thumbnail: "https://picsum.photos/300/201",
      video_url: "https://www.w3schools.com/html/movie.mp4"
    }
  ]);
}
