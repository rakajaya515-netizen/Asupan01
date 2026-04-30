export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const id = searchParams.get("id");

  const API_KEY = process.env.VIDARA_API_KEY;

  // VIDARA
  if (source === "vidara") {
    try {
      const res = await fetch(
        `https://api.vidara.so/v1/video/info?api_key=${API_KEY}&filecode=${id}`
      );
      const data = await res.json();

      const video = data.result[0];

      return Response.json({
        title: video.video_title,
        // 🔥 EMBED CLEAN (NO IKLAN)
        url: `https://vidara.so/embed-${video.filecode}.html`
      });
    } catch {
      return Response.json({ url: "", title: "" });
    }
  }

  // DOODSTREAM
  if (source === "dood") {
    return Response.json({
      title: "Dood Video",
      url: `https://dood.so/e/${id}`
    });
  }

  return Response.json({ url: "", title: "" });
}
