let cache = {
  data: null,
  time: 0
}

// ======================
// RANDOM SHUFFLE
// ======================
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

export default async function handler(req, res) {
  const now = Date.now()

  // ======================
  // CACHE 30 DETIK
  // ======================
  if (cache.data && now - cache.time < 30000) {
    return res.status(200).json(cache.data)
  }

  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const DOOD_KEY = process.env.DOOD_API_KEY
  const VIZEY_KEY = process.env.VIZEY_API_KEY

  try {
    let vidara = []
    let dood = []
    let vizey = []

    // ======================
    // VIDARA
    // ======================
    if (VIDARA_KEY) {
      try {
        const r = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`)
        const j = await r.json()
        vidara = j?.result?.videos || []
      } catch {}
    }

    // ======================
    // DOOD
    // ======================
    if (DOOD_KEY) {
      try {
        const r = await fetch(`https://doodapi.co/api/file/list?key=${DOOD_KEY}`)
        const j = await r.json()
        dood = j?.result?.files || []
      } catch {}
    }

    // ======================
    // VIZEY
    // ======================
    if (VIZEY_KEY) {
      try {
        const r = await fetch(`https://vizey.com/api/file/list?key=${VIZEY_KEY}`)
        const j = await r.json()
        vizey = j?.result?.files || []
      } catch {}
    }

    // ======================
    // FORMAT DATA
    // ======================
    const allVideos = [
      ...vidara.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        filecode: v.filecode,
        source: "vidara"
      })),
      ...dood.map(v => ({
        title: v.title,
        thumbnail: v.splash_img || "",
        filecode: v.file_code,
        source: "dood"
      })),
      ...vizey.map(v => ({
        title: v.title,
        thumbnail: v.splash_img || "",
        filecode: v.file_code,
        source: "vizey"
      }))
    ]

    // ======================
    // RANDOM
    // ======================
    const shuffled = shuffle(allVideos)

    cache = {
      data: { videos: shuffled },
      time: now
    }

    res.status(200).json({ videos: shuffled })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
