  const CACHE_TTL = 60 * 1000 // 1 menit

let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  try {
    // 🔥 CACHE
    if (cache.data && Date.now() - cache.time < CACHE_TTL) {
      return res.status(200).json(cache.data)
    }

    const VIDARA_KEY = process.env.VIDARA_API_KEY
    const VIZEY_KEY = process.env.VIZEY_API_KEY

    let allVideos = []

    // =========================
    // VIDARA
    // =========================
    if (VIDARA_KEY) {
      try {
        const r = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`)
        const j = await r.json()

        const videos = j.result?.videos || []

        const mapped = videos.map(v => ({
          title: v.title || "Untitled",
          thumbnail: v.thumbnail,
          filecode: v.filecode,
          date: v.uploaded,
          source: "vidara"
        }))

        allVideos.push(...mapped)
      } catch (e) {
        console.log("Vidara error:", e.message)
      }
    }

    // =========================
    // VIZEY
    // =========================
    if (VIZEY_KEY) {
      try {
        const r = await fetch(`https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}`)
        const j = await r.json()

        const videos = j.data || []

        const mapped = videos.map(v => ({
          title: v.title || "Untitled",
          thumbnail: v.thumbnail,
          filecode: v.id,
          date: v.createdAt,
          source: "vizey"
        }))

        allVideos.push(...mapped)
      } catch (e) {
        console.log("Vizey error:", e.message)
      }
    }

    // =========================
    // SORT TERBARU
    // =========================
    allVideos.sort((a, b) => new Date(b.date) - new Date(a.date))

    // =========================
    // FALLBACK
    // =========================
    if (!allVideos.length) {
      return res.status(200).json({
        result: { videos: [] }
      })
    }

    const result = {
      result: {
        videos: allVideos
      }
    }

    cache = {
      data: result,
      time: Date.now()
    }

    res.status(200).json(result)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
