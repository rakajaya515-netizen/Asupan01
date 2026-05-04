export default async function handler(req, res) {
  const q = req.query.q || "";

  try {
    const vidara = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_API_KEY}&title=${q}`
    ).then(r => r.json());

    res.status(200).json(vidara.result?.videos || []);
  } catch {
    res.status(500).json([]);
  }
}
