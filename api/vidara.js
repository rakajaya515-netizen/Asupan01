export default async function handler(req, res) {
  const API_KEY = process.env.VIDARA_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY kosong" });
  }

  try {
    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=50`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0",
        }
      }
    );

    const text = await response.text();

    // 🔥 VALIDASI RESPONSE
    if (!text || text.startsWith("<")) {
      return res.status(500).json({
        error: "Vidara bukan JSON",
        raw: text.slice(0, 200)
      });
    }

    let data = JSON.parse(text);

    let videos = [];

    if (Array.isArray(data)) {
      videos = data;
    } else if (data.result?.videos) {
      videos = data.result.videos;
    } else if (data.result) {
      videos = data.result;
    }

    // ✅ HEADER HARUS DI ATAS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");

    return res.status(200).json(videos);

  } catch (err) {
    console.error("VIDARA ERROR:", err);

    return res.status(500).json({
      error: "Vidara fetch gagal",
      message: err.message
    });
  }
}
