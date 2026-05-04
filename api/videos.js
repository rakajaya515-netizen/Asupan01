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

  let allVideos = []

  try {
    // =========================
    // 🔥 FETCH VIZEY (FIX URL)
    // =========================
    let vizeyVideos = []

    if (VIZEY_KEY) {
      try {
        const resVizey = await fetch(
          `https://vizey.co/api/v1/list?apikey=${VIZEY_KEY}&page=1`
        )
        const json = await resVizey.json()

        if (json?.data) {
          vizeyVideos = json.data.map(v => ({
            title: v.title,
            thumbnail: v.thumbnail,
            filecode: v.id,
            source: "vizey",
            createdAt: v.createdAt
          }))
        }
      } catch (err) {
        console.log("VIZEY ERROR:", err.message)
      }
    }

    // =========================
    // 🔥 FETCH VIDARA
    // =========================
    let vidaraVideos = []

if (VIDARA_KEY) {
  try {
    const resVidara = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
    )

    const json = await resVidara.json()

    if (json?.result?.videos) {
      vidaraVideos = json.result.videos.map(v => ({
        title: v.title || "No title",
        thumbnail: v.thumbnail,
        filecode: v.filecode,
        source: "vidara",
        createdAt: v.created_at || new Date().toISOString()
      }))
    } else {
      console.log("VIDARA EMPTY:", json)
    }

  } catch (err) {
    console.log("VIDARA ERROR:", err.message)
  }
}

    // =========================
    // 🔥 FALLBACK LOGIC
    // =========================
    allVideos =
      vizeyVideos.length > 0 ? vizeyVideos : vidaraVideos

    // =========================
    // 🔥 SORT TERBARU
    // =========================
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
    console.log("FATAL ERROR:", err.message)

    // ❗ jangan bikin crash
    return res.status(200).json([])
  }
}
