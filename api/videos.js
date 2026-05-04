export default async function handler(req, res) {
  const vidaraKey = process.env.VIDARA_API_KEY;
  const vizeyKey = process.env.VIZEY_API_KEY;

  try {
    const [vidaraRes, vizeyRes] = await Promise.all([
      fetch(`https://api.vidara.so/v1/video/list?api_key=${vidaraKey}&limit=20`),
      fetch(`https://vizey.co/api/v1/list?apikey=${vizeyKey}`)
    ]);

    const vidara = await vidaraRes.json();
    const vizey = await vizeyRes.json();

    const videos = [];

    // VIDARA
    if (vidara?.result?.videos) {
      vidara.result.videos.forEach(v => {
        videos.push({
          title: v.title,
          thumbnail: v.thumbnail,
          url: `https://vidara.so/${v.filecode}`
        });
      });
    }

    // VIZEY
    if (vizey?.data) {
      vizey.data.forEach(v => {
        videos.push({
          title: v.title,
          thumbnail: v.thumbnail,
          url: v.url
        });
      });
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(videos);

  } catch (err) {
    res.status(500).json({ error: "Gagal fetch API" });
  }
}
