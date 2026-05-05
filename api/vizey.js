export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  try {
    const response = await fetch(
      `https://vizey.co/api/v1/list?apikey=${API_KEY}`
    );

    const text = await response.text();

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "s-maxage=60");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).send(text); // 🔥 kirim raw
  } catch (err) {
    return res.status(500).send("Vizey error");
  }
}
