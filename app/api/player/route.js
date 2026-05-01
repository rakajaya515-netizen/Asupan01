export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const source = searchParams.get("source");
  const id = searchParams.get("id");

  const API_KEY = process.env.VIDARA_API_KEY;

  // ===== VIDARA =====
  if (source === "vidara") {
    try {
      const filecode = id.split("/").pop();

      const res = await fetch(
        `https://api.vidara.so/v1/video/info?api_key=${API_KEY}&filecode=${filecode}`
      );

      const data = await res.json();

      const video = data.result[0];

      return Response.json({
        title: video.video_title,
        // 🔥 gunakan embed clean
        url: `https://vidara.so/embed-${video.filecode}.html`,
      });
    } catch (e) {
      return Response.json({ url: "", title: "error vidara" });
    }
  }

  // ===== DOODSTREAM =====
  if (source === "doodstream") {
    return Response.json({
      title: "Dood Video",
      url: id, // langsung pakai link dood
    });
  }

  return Response.json({ url: "", title: "" });
}
