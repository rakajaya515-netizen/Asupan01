export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.vidara.com/videos", {
      headers: {
        Authorization: `Bearer ${process.env.VIDARA_KEY}`
      }
    });

    const data = await response.json();

    // cache 5 menit
    res.setHeader("Cache-Control", "s-maxage=300");

    res.status(200).json(data.results || data || []);
  } catch (err) {
    res.status(200).json([]); // jangan error biar frontend tetap jalan
  }
}
