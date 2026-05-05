export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  try {
    const response = await fetch(
      `https://vizey.co/api/v1/list?apikey=${API_KEY}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json(data.data || []);
    res.setHeader("Access-Control-Allow-Origin", "*");
    
  } catch (err) {
    res.status(500).json({ error: "Vizey error" });
  }
}
