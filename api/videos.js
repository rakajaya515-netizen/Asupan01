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

  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const VIZEY_KEY = process.env.VIZEY_API_KEY

  let vidaraVideos = []
  let vizeyVideos = []

  try {
    // =========================
    // 🔥 FETCH VIZEY (MULTI PAGE)
    // =========================
    if (VIZEY_KEY) {
      let page = 1
      let hasNext = true

      while (hasNext && page <= 3) { // limit 3 page biar cepat
        const resVizey = await fetch(
          `https://vizey.co/api/v1/video/list?apikey=${VIZEY_KEY}&page=${page}`
        )
        const json = await resVizey.json()

        if (json?.data) {
          vizeyVideos.push(...json.data)
        }

        hasNext = json?.pagination?.hasNext || false
        page++
      }
    }

    // =========================
    // 🔥 FETCH VIDARA
    // =========================
    if (VIDARA_KEY) {
      const resVidara = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      )
      const json = await resVidara.json()
      vidaraVideos = json?.result?.videos || []
    }

    // =========================
    // 🔥 FORMAT VIZEY
    // =========================
    const formattedVizey = vizeyVideos.map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      filecode: v.id,
      source: "vizey",
      createdAt: v.createdAt || new Date().toISOString()
    }))

    // =========================
    // 🔥 FORMAT VIDARA
    // =========================
    const formattedVidara = vidaraVideos.map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      filecode: v.filecode,
      source: "vidara",
      createdAt: v.created_at || new Date().toISOString()
    }))

    // =========================
    // 🔥 FALLBACK LOGIC
    // =========================
    let allVideos = []

    if (formattedVizey.length > 0) {
      allVideos = [...formattedVizey, ...formattedVidara]
    } else {
      allVideos = formattedVidara
    }

    // =========================
    // 🔥 SORT BY DATE (TERBARU)
    // =========================
    allVideos.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    // =========================
    // 🔥 LIMIT (biar ringan)
    // =========================
    allVideos = allVideos.slice(0, 200)

    const result = {
      videos: allVideos
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
