const CACHE_TTL = 60 * 1000 // 1 menit
let cache = {
  data: null,
  time: 0
}

   export default async function handler(req, res) {
  try {
    const VIZEY_KEY = process.env.VIZEY_API_KEY
    const VIDARA_KEY = process.env.VIDARA_API_KEY

    let videos = []

    // =========================
    // 🔥 VIZEY
    // =========================
    if (VIZEY_KEY) {
      const r = await fetch(
        `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
      )
      const j = await r.json()

      if (j.data) {
        const vizey = j.data.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail, // ✅ sudah benar dari API
          url: `https://vizey.co/v/${v.id}`, // ✅ FIX PLAY
          createdAt: v.createdAt
        }))

        videos.push(...vizey)
      }
    }

    // =========================
    // 🔥 VIDARA (FIX FORMAT)
    // =========================
    if (VIDARA_KEY) {
      const r = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      )
      const j = await r.json()

      // 🔥 PERHATIKAN INI (beda format)
      const list = j?.data || j?.result || []

      const vidara = list.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail || v.screenshot || "",
        url: `https://vidara.so/v/${v.filecode}`, // ✅ FIX PLAY
        createdAt: v.created_at
      }))

      videos.push(...vidara)
    }

    // =========================
    // 🔥 SORT TERBARU
    // =========================
    videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.status(200).json(videos)

  } catch (e) {
    res.status(500).json({
      error: true,
      message: e.message
    })
  }
        }
