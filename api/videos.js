export default async function handler(req, res) {
  try {
    const vidaraKey = process.env.VIDARA_API_KEY;
    const doodKey   = process.env.DOOD_API_KEY;

    let videos = [];

    /* =========================
       VIDARA LIST VIDEO
    ========================= */
    try {
      const vidaraRes = await fetch(
        `https://api.vidara.so/v1/file/list?api_key=${vidaraKey}`
      );

      const vidaraJson = await vidaraRes.json();

      const vidaraVideos = (vidaraJson.result || []).map(v => ({
        title: v.title || v.name || "No title",
        thumbnail: v.thumbnail || v.thumb || "https://picsum.photos/300/200",
        video_url: v.file_code
          ? `https://vidara.so/e/${v.file_code}`
          : ""
      }));

      videos.push(...vidaraVideos);
    } catch (e) {
      console.log("Vidara error:", e.message);
    }

    /* =========================
       DOODSTREAM LIST
    ========================= */
    try {
      const doodRes = await fetch(
        `https://doodapi.com/api/file/list?key=${doodKey}`
      );

      const doodJson = await doodRes.json();

      const doodVideos = (doodJson.result?.files || []).map(v => ({
        title: v.title || "No title",
        thumbnail: v.thumbnail || "https://picsum.photos/300/200",
        video_url: `https://doodstream.com/e/${v.file_code}`
      }));

      videos.push(...doodVideos);
    } catch (e) {
      console.log("Dood error:", e.message);
    }

    /* =========================
       FALLBACK
    ========================= */
    if (!videos.length) {
      return res.status(200).json([
        {
          title: "Sample Video",
          thumbnail: "https://picsum.photos/300/200",
          video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
      ]);
    }

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
