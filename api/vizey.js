export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.vizey.com/videos", {
      headers: {
        Authorization: `Bearer ${process.env.VIZEY_KEY}`
      }
    });

    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=300");

    res.status(200).json(data.results || data || []);
  } catch (err) {
    res.status(200).json([]);
  }
}
