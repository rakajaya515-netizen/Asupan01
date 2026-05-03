export default async function handler(req, res) {
  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const DOOD_KEY = process.env.DOOD_API_KEY

  try {
    // ========================
    // 🔥 FETCH VIDARA
    // ========================
    let vidaraVideos = []

    if (VIDARA_KEY) {
      const vidaraRes = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
      )

      const vidaraJson = await vidaraRes.json()
      vidaraVideos = vidaraJson.result?.videos || []
    }

    // ========================
    // 🔥 FETCH DOODSTREAM
    // ========================
    let doodVideos = []

    if (DOOD_KEY) {
      const doodRes = await fetch(
        `https://doodapi.co/api/file/list?key=${DOOD_KEY}`
      )

      const doodJson = await doodRes.json()
      doodVideos = doodJson.result || []
    }

    // ========================
    // 🔥 FORMAT VIDARA
    // ========================
    const formattedVidara = vidaraVideos.map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      filecode: v.filecode,
      source: "vidara"
    }))

    // ========================
    // 🔥 FORMAT DOOD
    // ========================
    const formattedDood = doodVideos.map(v => ({
      title: v.title,
      thumbnail: v.splash_img || v.thumbnail || "",
      filecode: v.file_code,
      source: "dood"
    }))

    // ========================
    // 🔥 GABUNG
    // ========================
    const allVideos = [
      ...formattedVidara,
      ...formattedDood
    ]

    return res.status(200).json({
      result: {
        videos: allVideos
      }
    })

  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}
