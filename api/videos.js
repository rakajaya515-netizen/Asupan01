let cache = {};
let lastFetch = {};

const CACHE_TTL = 60 * 5; // 5 menit

export default async function handler(req, res) {
  const { page = 1, q = "" } = req.query;
  const key = `${page}_${q}`;

  // 🔥 cek cache dulu
  if (cache[key] && Date.now() - lastFetch[key] < CACHE_TTL * 1000) {
    return res.status(200).json(cache[key]);
  }

  try {
    const v1 = await fetch(`https://YOUR_VIDARA_API?page=${page}&q=${q}`);
    const v2 = await fetch(`https://YOUR_VIZEY_API?page=${page}&q=${q}`);

    const d1 = await v1.json();
    const d2 = await v2.json();

    let videos = [...(d1.videos || []), ...(d2.videos || [])].map((v, i) => ({
      id: v.id || i,
      title: v.title || "No title",
      thumbnail:
        v.thumbnail ||
        v.cover ||
        v.image ||
        "https://via.placeholder.com/300x400?text=No+Image",
      url: v.url || v.link || "#"
    }));

    // 🔥 hilangkan duplikat
    const unique = [];
    const seen = new Set();

    for (let v of videos) {
      if (!seen.has(v.url)) {
        seen.add(v.url);
        unique.push(v);
      }
    }

    // 🔥 simpan cache
    cache[key] = unique;
    lastFetch[key] = Date.now();

    // 🔥 CDN cache (Vercel edge)
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    res.status(200).json(unique);
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
}
