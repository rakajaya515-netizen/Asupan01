export default async function handler(req, res) {
  const API_KEY = process.env.VIDARA_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY kosong" });
  }

  try {
    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "JSON parse gagal", raw: text });
    }

    let videos = [];

    if (Array.isArray(data)) {
      videos = data;
    } else if (data.result?.videos) {
      videos = data.result.videos;
    } else if (data.result) {
      videos = data.result;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json(videos);

  } catch (err) {
    res.status(500).json({ error: "Vidara fetch gagal" });
  }
}
