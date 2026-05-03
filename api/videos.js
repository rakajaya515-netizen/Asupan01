let cache = null
let lastFetch = 0

const CACHE_TIME = 60 * 1000

export default async function handler(req, res) {
  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const DOOD_KEY = process.env.DOOD_API_KEY

  try {
    let vidaraVideos = []
    let doodVideos = []

    // VIDARA
    if (VIDARA_KEY) {
      try {
        const r = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`)
        const j = await r.json()
        vidaraVideos = j?.result?.videos || []
      } catch (e) {
        console.log("Vidara error:", e.message)
      }
    }

    // DOOD
    if (DOOD_KEY) {
      try {
        const r = await fetch(`https://doodapi.co/api/file/list?key=${DOOD_KEY}`)
        const j = await r.json()
        doodVideos = j?.result?.files || []
      } catch (e) {
        console.log("Dood error:", e.message)
      }
    }

    const formatted = [
      ...vidaraVideos.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        filecode: v.filecode,
        source: "vidara"
      })),
      ...doodVideos.map(v => ({
        title: v.title,
        thumbnail: v.splash_img || "",
        filecode: v.file_code,
        source: "dood"
      }))
    ]

    res.status(200).json({ videos: formatted })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
