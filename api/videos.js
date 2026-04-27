export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIDARA_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API KEY tidak ditemukan" });
    }

    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${API_KEY}`
    );

    const text = await response.text(); // debug dulu

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ error: "Response bukan JSON", raw: text });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
