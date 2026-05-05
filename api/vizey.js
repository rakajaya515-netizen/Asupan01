export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY kosong" });
  }

  try {
    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Referer": "https://vizey.net/"
        }
      }
    );

    const text = await response.text();

    if (!text || text.startsWith("<")) {
      return res.status(500).json({
        error: "Vizey bukan JSON",
        raw: text.slice(0, 200)
      });
    }

    const data = JSON.parse(text);

    const videos = data.data || data.result || [];

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");

    return res.status(200).json(videos);

  } catch (err) {
    console.error("VIZEY ERROR:", err);

    return res.status(500).json({
      error: "Vizey fetch gagal",
      message: err.message
    });
  }
}
