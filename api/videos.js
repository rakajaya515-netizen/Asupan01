const CACHE_TTL = 60 * 1000 // 1 menit
let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  const now = Date.now()

  // ✅ CACHE
  if (cache.data && now - cache.time < CACHE_TTL) {
    return res.status(200).json(cache.data)
  }

  const VIZEY_KEY = process.env.VIZEY_API_KEY
  const VIDARA_KEY = process.env.VIDARA_API_KEY

  let vizeyVideos = []
  let vidaraVideos = []

  try {
    // =========================
    // 🔥 VIZEY
    // =========================
    if (VIZEY_KEY) {
      try {
        const r = await fetch(
          `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
        )
        const j = await r.json()

        if (j?.data) {
          vizeyVideos = j.data.map(v => ({
            title: v.title,
            thumbnail: v.thumbnail,
            url: v.url,               // ✅ link asli
            embed: v.embed_url,
            source: "vizey",
            createdAt: v.createdAt
          }))
        }
      } catch (e) {
        console.log("VIZEY ERROR:", e.message)
      }
    }

    // =========================
    // 🔥 VIDARA
    // =========================
    if (VIDARA_KEY) {
      try {
        const r = await fetch(
          `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
        )
        const j = await r.json()

        if (j?.result?.videos) {
          vidaraVideos = j.result.videos.map(v => ({
            title: v.title,
            thumbnail: v.thumbnail,
            url: `https://vidara.so/v/${v.filecode}`, // ✅ link play
            source: "vidara",
            createdAt: v.created_at
          }))
        }
      } catch (e) {
        console.log("VIDARA ERROR:", e.message)
      }
    }

    // =========================
    // 🔥 GABUNG + SORT
    // =========================
    let allVideos = [...vizeyVideos, ...vidaraVideos]

    allVideos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    // =========================
    // 🔥 CACHE SAVE
    // =========================
    cache = {
      data: allVideos,
      time: now
    }

    return res.status(200).json(allVideos)

  } catch (err) {
    console.log("FATAL:", err.message)
    return res.status(200).json([])
  }
}
