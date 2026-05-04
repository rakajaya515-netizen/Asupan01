export default async function handler(req, res) {
  try {
    // VIDARA
    const vidaraRes = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_API_KEY}&limit=20`
    );
    const vidara = await vidaraRes.json();

    // VIZEY
    const vizeyRes = await fetch(
      `https://vizey.co/api/v1/list?apikey=${process.env.VIZEY_API_KEY}`
    );
    const vizey = await vizeyRes.json();

    // NORMALIZE DATA (INI KUNCI)
    const vidaraVideos = (vidara?.result?.videos || []).map(v => ({
      title: v.video_title || "No title",
      thumbnail: v.player_img || "",
      url: v.link || ""
    }));

    const vizeyVideos = (vizey?.data || []).map(v => ({
      title: v.title || "No title",
      thumbnail: v.thumbnail || "",
      url: v.url || ""
    }));

    const data = [...vidaraVideos, ...vizeyVideos];

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
