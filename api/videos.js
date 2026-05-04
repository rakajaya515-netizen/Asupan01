export default async function handler(req, res) {
  const cacheKey = "videos_cache";

  if (global[cacheKey]) {
    return res.status(200).json(global[cacheKey]);
  }

  try {
    const vidara = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_API_KEY}&limit=20`
    ).then(r => r.json());

    const vizey = await fetch(
      `https://vizey.co/api/v1/list?apikey=${process.env.VIZEY_API_KEY}`
    ).then(r => r.json());

    const data = [
      ...(vidara.result?.videos || []),
      ...(vizey.data || [])
    ];

    global[cacheKey] = data;

    // cache 60 detik
    setTimeout(() => delete global[cacheKey], 60000);

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed fetch API" });
  }
}
