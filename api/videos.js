const CACHE_TTL = 60 * 1000 // 1 menit
let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  const VIZEY_KEY = process.env.VIZEY_API_KEY;
  const VIDARA_KEY = process.env.VIDARA_API_KEY;

  let videos = [];

  try {
    // ===== VIZEY =====
    if (VIZEY_KEY) {
      const r = await fetch(
        `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
      );
      const j = await r.json();

      if (j.success && j.data) {
        videos.push(...j.data.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail,
          filecode: v.id,
          source: "vizey"
        })));
      }
    }

    // ===== VIDARA =====
    if (VIDARA_KEY) {
      const r = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      );
      const j = await r.json();

      if (j.result?.videos) {
        videos.push(...j.result.videos.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail,
          filecode: v.filecode,
          source: "vidara"
        })));
      }
    }

    res.status(200).json(videos);

  } catch (err) {
    res.status(500).json({ error: "API error" });
  }
}
