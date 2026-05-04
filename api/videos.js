const CACHE_TTL = 60 * 1000 // 1 menit

let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.time < CACHE_TTL) {
    return res.status(200).json(cache.data)
  }

  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const VIZEY_KEY = process.env.VIZEY_API_KEY

  let allVideos = []

  // =========================
  // FETCH VIZEY (PRIORITAS)
  // =========================
  if (VIZEY_KEY) {
    try {
      const r = await fetch(
        `https://api.vizey.co/api/v1/list?apikey=${VIZEY_KEY}`
      )
      const j = await r.json()

      const vids = j?.data?.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        filecode: v.id,
        date: v.createdAt,
        source: "vizey"
      })) || []

      allVideos.push(...vids)
    } catch (e) {
      console.log("Vizey error:", e.message)
    }
  }

  // =========================
  // FETCH VIDARA (FALLBACK)
  // =========================
  if (VIDARA_KEY) {
    try {
      const r = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      )
      const j = await r.json()

      const vids = j?.result?.videos?.map(v => ({
  title: v.title,
  thumbnail: v.thumbnail,
  filecode: v.filecode,
  link: v.link, // 🔥 PENTING
  date: v.uploaded,
  source: "vidara"
})) || []

      allVideos.push(...vids)
    } catch (e) {
      console.log("Vidara error:", e.message)
    }
  }

  // =========================
  // SORT TERBARU
  // =========================
  allVideos = allVideos.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const result = { result: { videos: allVideos } }

  cache = {
    data: result,
    time: Date.now()
  }

  res.status(200).json(result)
}
