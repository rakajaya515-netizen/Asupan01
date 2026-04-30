export default async function handler(req, res) {
  try {
    const vidaraKey = process.env.VIDARA_API_KEY;
    const doodKey = process.env.DOOD_API_KEY;

    let videos = [];

    /* =========================
       VIDARA (contoh struktur)
    ========================= */
    try {
      const vRes = await fetch("https://example-vidara-api.com/videos", {
        headers: {
          Authorization: `Bearer ${vidaraKey}`
        }
      });

      const vData = await vRes.json();

      const vidaraVideos = (vData.data || []).map(v => ({
        title: v.title || "No title",
        thumbnail: v.thumbnail || "",
        video_url: v.file || v.embed_url
      }));

      videos.push(...vidaraVideos);
    } catch (e) {
      console.log("Vidara error:", e.message);
    }

    /* =========================
       DOODSTREAM (contoh)
    ========================= */
    try {
      const dRes = await fetch("https://example-dood-api.com/videos", {
        headers: {
          Authorization: doodKey
        }
      });

      const dData = await dRes.json();

      const doodVideos = (dData.result || []).map(v => ({
        title: v.title || "No title",
        thumbnail: v.thumb || "",
        video_url: v.embed_url || v.file
      }));

      videos.push(...doodVideos);
    } catch (e) {
      console.log("Dood error:", e.message);
    }

    /* =========================
       FALLBACK (biar gak kosong)
    ========================= */
    if (videos.length === 0) {
      videos = [
        {
          title: "Fallback Video",
          thumbnail: "https://picsum.photos/300/200",
          video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
      ];
    }

    res.status(200).json(videos);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
