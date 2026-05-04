export default async function handler(req, res) {
  try {
    const vidaraRes = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_API_KEY}&limit=20`
    );
    const vidara = await vidaraRes.json();

    const vizeyRes = await fetch(
      `https://vizey.co/api/v1/list?apikey=${process.env.VIZEY_API_KEY}`
    );
    const vizey = await vizeyRes.json();

    const data = [
      ...(vidara?.result?.videos || []).map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        url: v.link
      })),
      ...(vizey?.data || []).map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        url: v.url
      }))
    ];

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
