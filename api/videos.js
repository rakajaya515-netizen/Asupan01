const CACHE_TTL = 60 * 1000; // 60 detik

let cache = {
  data: null,
  time: 0
};

export default async function handler(req, res) {
  const now = Date.now();

  // ⚡ RETURN CACHE (INSTANT)
  if (cache.data && now - cache.time < CACHE_TTL) {
    console.log("⚡ CACHE HIT");
    return res.status(200).json(cache.data);
  }

  console.log("🔥 FETCH API");

  const VIZEY_KEY = process.env.VIZEY_API_KEY;
  const VIDARA_KEY = process.env.VIDARA_API_KEY;

  let videos = [];

  try {
    // ===== VIZEY =====
    if (VIZEY_KEY) {
      const r = await fetch("/api/videos", {
  cache: "force-cache"
});
        `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
      );
      const j = await r.json();

      if (j.success && j.data) {
        videos.push(...j.data.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail,
          filecode: v.id,
          source: "vizey",
          createdAt: v.createdAt || new Date().toISOString()
        })));
      }
    }

    // ===== VIDARA =====
    if (VIDARA_KEY) {
      const r = await fetch("/api/videos", {
  cache: "force-cache"
});
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      );
      const j = await r.json();

      if (j.result?.videos) {
        videos.push(...j.result.videos.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail,
          filecode: v.filecode,
          source: "vidara",
          createdAt: v.created_at || new Date().toISOString()
        })));
      }
    }

    // 🔥 SORT TERBARU
    videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 💾 SIMPAN CACHE
    cache = {
      data: videos,
      time: now
    };

    // ⚡ CDN CACHE HEADER (PENTING)
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );

    res.status(200).json(videos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
}
