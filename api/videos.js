let cache = {
  data: null,
  time: 0
}

export default async function handler(req, res) {
  const now = Date.now()

  // ======================
  // CACHE 60 DETIK
  // ======================
  if (cache.data && now - cache.time < 60000) {
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
    // VIZEY (mirip dood biasanya)
    // ======================
    if (VIZEY_KEY) {
      try {
        const r = await fetch(`https://vizey.com/api/file/list?key=${VIZEY_KEY}`)
        const j = await r.json()
        vizey = j?.result?.files || []
      } catch {}
    }

    // ======================
    // FORMAT SEMUA
    // ======================
    const videos = [
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
    // SIMPAN CACHE
    // ======================
    cache = {
      data: { videos },
      time: now
    }

    res.status(200).json({ videos })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
