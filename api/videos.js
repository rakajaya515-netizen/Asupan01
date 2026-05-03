export default async function handler(req, res) {
  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const DOOD_KEY = process.env.DOOD_API_KEY

  try {
    // ========================
    // 🔥 VIDARA
    // ========================
    let vidaraVideos = []

    if (VIDARA_KEY) {
      try {
        const vidaraRes = await fetch(
          `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
        )

        const vidaraJson = await vidaraRes.json()

        console.log("VIDARA:", vidaraJson)

        vidaraVideos = Array.isArray(vidaraJson.result?.videos)
          ? vidaraJson.result.videos
          : []

      } catch (e) {
        console.log("VIDARA ERROR:", e.message)
      }
    }

    // ========================
    // 🔥 DOODSTREAM
    // ========================
    let doodVideos = []

    if (DOOD_KEY) {
      try {
        const doodRes = await fetch(
          `https://doodapi.co/api/file/list?key=${DOOD_KEY}`
        )

        const doodJson = await doodRes.json()

        console.log("DOOD:", doodJson)

        // 🔥 HANDLE SEMUA FORMAT
        if (Array.isArray(doodJson.result)) {
          doodVideos = doodJson.result
        } else if (Array.isArray(doodJson.result?.files)) {
          doodVideos = doodJson.result.files
        } else {
          doodVideos = []
        }

      } catch (e) {
        console.log("DOOD ERROR:", e.message)
      }
    }

    // ========================
    // 🔥 FORMAT VIDARA
    // ========================
    const formattedVidara = vidaraVideos.map(v => ({
      title: v.title || "No title",
      thumbnail: v.thumbnail || "",
      filecode: v.filecode,
      source: "vidara"
    }))

    // ========================
    // 🔥 FORMAT DOOD
    // ========================
    const formattedDood = doodVideos.map(v => ({
      title: v.title || "No title",
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
