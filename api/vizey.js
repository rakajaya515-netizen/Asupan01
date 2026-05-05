export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  try {
    const response = await fetch(
      `https://vizey.co/api/v1/list?apikey=${API_KEY}`
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Parse gagal", raw: text });
    }

    const videos = data.data || data || [];

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json(videos);

  } catch (err) {
    res.status(500).json({ error: "Vizey error" });
  }
}
