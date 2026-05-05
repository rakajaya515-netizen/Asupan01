export default async function handler(req, res) {
  let result = [];

  // ===== VIDARA =====
  try {
    const r = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_API_KEY}&limit=20`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const d = await r.json();

    const vids = d.result?.videos || d.result || [];

    result.push(...vids.map(v => ({
      title: v.title || v.video_title || "No title",
      thumb: v.thumbnail || v.player_img,
      link: v.link
    })));

  } catch (e) {
    console.log("Vidara fail");
  }

  // ===== VIZEY =====
  try {
    const r = await fetch(
      `https://vizey.co/api/v1/list?apikey=${process.env.VIZEY_API_KEY}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const d = await r.json();

    const vids = d.data || [];

    result.push(...vids.map(v => ({
      title: v.title,
      thumb: v.thumbnail,
      link: v.url || `https://vizey.co/${v.id}`
    })));

  } catch (e) {
    console.log("Vizey fail");
  }

  // ===== FALLBACK (ANTI KOSONG) =====
  if (!result.length) {
    result = [
      {
        title: "Video tidak tersedia (API error)",
        thumb: "https://via.placeholder.com/300x200",
        link: "#"
      }
    ];
  }

  res.setHeader("Cache-Control", "s-maxage=60");
  res.status(200).json(result);
}
