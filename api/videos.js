let cache = null
let lastFetch = 0

const CACHE_TIME = 60 * 1000

export default async function handler(req, res) {
  const now = Date.now()

  if (cache && now - lastFetch < CACHE_TIME) {
    return res.status(200).json(cache)
  }

  try {
    const VIDARA_KEY = process.env.VIDARA_API_KEY
    const DOOD_KEY = process.env.DOOD_API_KEY

    let vidara = []
    let dood = []

    // VIDARA
    if (VIDARA_KEY) {
      const r = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`)
      const j = await r.json()

      vidara = j.result?.videos?.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        filecode: v.filecode,
        source: "vidara"
      })) || []
    }

    // DOOD
    if (DOOD_KEY) {
      const r = await fetch(`https://doodapi.co/api/file/list?key=${DOOD_KEY}`)
      const j = await r.json()

      dood = j.result?.map(v => ({
        title: v.title,
        thumbnail: v.splash_img || v.thumbnail || "",
        filecode: v.file_code,
        source: "dood"
      })) || []
    }

    let all = [...vidara, ...dood]

    // 🔥 FILTER + RANDOM (CTR BOOST)
    all = all
      .filter(v => v.thumbnail && v.title)
      .sort(() => Math.random() - 0.5)

    const result = { result: { videos: all } }

    cache = result
    lastFetch = now

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate")

    return res.status(200).json(result)

  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
