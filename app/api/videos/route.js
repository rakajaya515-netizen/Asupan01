export async function GET() {
  try {
    const DOOD_API_KEY = process.env.DOOD_API_KEY;
    const VIDARA_API_KEY = process.env.VIDARA_API_KEY;

    let doodVideos = [];
    let vidaraVideos = [];

    // DOODSTREAM
    try {
      const res = await fetch(
        `https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`
      );
      const data = await res.json();

      if (data?.result?.files) {
        doodVideos = data.result.files.map((v) => ({
          title: v.title,
          url: `https://dood.so/e/${v.file_code}`,
          thumbnail: v.splash_img || "",
          source: "doodstream",
        }));
      }
    } catch (e) {}

    // VIDARA (VIDEO TERBARU)
    try {
      const res = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_API_KEY}&page=1&limit=50`
      );
      const data = await res.json();

      if (data?.result?.videos) {
        vidaraVideos = data.result.videos.map((v) => ({
          title: v.title,
          url: v.link,
          thumbnail: v.thumbnail,
          source: "vidara",
        }));
      }
    } catch (e) {}

    // GABUNG + BALIK (BIAR TERBARU DI ATAS)
    const allVideos = [...vidaraVideos, ...doodVideos];

    return Response.json(allVideos);
  } catch (err) {
    return Response.json({ error: "fail" }, { status: 500 });
  }
}
