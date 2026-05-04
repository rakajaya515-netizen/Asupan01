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
  const VIDARA_KEY = process.env.VIDARA_API_KEY
  const VIZEY_KEY = process.env.VIZEY_API_KEY

  try {
    let allVideos = []

    // =========================
    // FETCH VIDARA
    // =========================
    if (VIDARA_KEY) {
      try {
        const vidaraRes = await fetch(
          `https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}`
        )

        const vidaraJson = await vidaraRes.json()

        const vidaraVideos =
          vidaraJson?.result?.videos?.map((v) => ({
            title: v.title || "Untitled",
            thumbnail: v.thumbnail || "",
            filecode: v.filecode,
            source: "vidara"
          })) || []

        allVideos.push(...vidaraVideos)
      } catch (e) {
        console.log("Vidara error:", e.message)
      }
    }

    // =========================
    // FETCH VIZEY
    // =========================
    if (VIZEY_KEY) {
      try {
        const vizeyRes = await fetch(
          `https://api.vizey.com/v1/video/list?api_key=${VIZEY_KEY}`
        )

        const vizeyJson = await vizeyRes.json()

        const vizeyVideos =
          vizeyJson?.result?.videos?.map((v) => ({
            title: v.title || "Untitled",
            thumbnail: v.thumbnail || "",
            filecode: v.filecode,
            source: "vizey"
          })) || []

        allVideos.push(...vizeyVideos)
      } catch (e) {
        console.log("Vizey error:", e.message)
      }
    }

    // =========================
    // RANDOM ORDER
    // =========================
    allVideos = allVideos.sort(() => Math.random() - 0.5)

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
