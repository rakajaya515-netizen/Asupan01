const CACHE_TTL = 60 * 1000 // 1 menit

let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  const now = Date.now()

  // 🔥 CACHE BIAR CEPAT
  if (cache.data && now - cache.time < CACHE_TTL) {
    return res.status(200).json(cache.data)
  }

  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const VIZEY_KEY = process.env.VIZEY_API_KEY

  console.log("VIDARA:", !!process.env.VIDARA_API_KEY)
console.log("VIZEY:", !!process.env.VIZEY_API_KEY)
  let allVideos = []

  try {
    // =========================
    // 🔥 FETCH VIZEY (FIXED)
    // =========================
    if (VIZEY_KEY) {
      try {
        const vizeyRes = await fetch(
          `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
        )

        const vizeyJson = await vizeyRes.json()

        const vizeyVideos =
          vizeyJson?.data?.map(v => ({
            title: v.title || "Untitled",
            thumbnail: v.thumbnail,
            filecode: v.id,
            date: v.createdAt,
            source: "vizey"
          })) || []

        allVideos.push(...vizeyVideos)
      } catch (e) {
        console.log("Vizey error:", e.message)
      }
    }

    // =========================
    // 🔥 FETCH VIDARA
    // =========================
    if (VIDARA_KEY) {
      try {
        const vidaraRes = await fetch(
          `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
        )

        const vidaraJson = await vidaraRes.json()

        const vidaraVideos =
          vidaraJson?.result?.videos?.map(v => ({
            title: v.title || "Untitled",
            thumbnail: v.thumbnail,
            filecode: v.filecode,
            date: v.uploaded_at || Date.now(),
            source: "vidara"
          })) || []

        allVideos.push(...vidaraVideos)
      } catch (e) {
        console.log("Vidara error:", e.message)
      }
    }

    // =========================
    // 🔥 FALLBACK
    // =========================
    if (allVideos.length === 0) {
      return res.status(200).json({
        result: { videos: [] }
      })
    }

    // =========================
    // 🔥 SORT BY DATE (TERBARU)
    // =========================
    allVideos.sort((a, b) => new Date(b.date) - new Date(a.date))

    const result = {
      result: {
        videos: allVideos
      }
    }

    // SAVE CACHE
    cache = {
      data: result,
      time: now
    }

    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}
