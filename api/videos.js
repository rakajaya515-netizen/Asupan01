let cache = null
let lastFetch = 0

const CACHE_TIME = 60 * 1000 // 60 detik

export default async function handler(req, res) {
  const now = Date.now()

  // 🚀 RETURN CACHE (SUPER CEPAT)
  if (cache && (now - lastFetch < CACHE_TIME)) {
    return res.status(200).json(cache)
  }

  try {
    const VIDARA_KEY = process.env.VIDARA_API_KEY
    const DOOD_KEY = process.env.DOOD_API_KEY

    let vidaraVideos = []
    let doodVideos = []

    // =====================
    // 🔥 FETCH VIDARA
    // =====================
    if (VIDARA_KEY) {
      const vidaraRes = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      )
      const vidaraJson = await vidaraRes.json()

      vidaraVideos = vidaraJson.result?.videos?.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        filecode: v.filecode,
        source: "vidara"
      })) || []
    }

    // =====================
    // 🔥 FETCH DOOD
    // =====================
    if (DOOD_KEY) {
      const doodRes = await fetch(
        `https://doodapi.co/api/file/list?key=${DOOD_KEY}`
      )
      const doodJson = await doodRes.json()

      doodVideos = doodJson.result?.map(v => ({
        title: v.title,
        thumbnail: v.splash_img || v.thumbnail || "",
        filecode: v.file_code,
        source: "dood"
      })) || []
    }

    // =====================
    // 🔥 GABUNG + SORT
    // =====================
    const allVideos = [...vidaraVideos, ...doodVideos].reverse()

    const response = {
      result: {
        videos: allVideos
      }
    }

    // 💾 SIMPAN CACHE
    cache = response
    lastFetch = now

    // 🚀 CDN CACHE
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    )

    return res.status(200).json(response)

  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}
