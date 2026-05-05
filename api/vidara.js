export default async function handler(req, res) {
  const API_KEY = process.env.VIDARA_API_KEY;

  try {
    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`
    );

    const text = await response.text();

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "s-maxage=60");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).send(text); // 🔥 kirim raw
  } catch (err) {
    return res.status(500).send("Vidara error");
  }
}
