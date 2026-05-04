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

  try {
    let allVideos = []

    // =========================
    // FETCH VIDARA MULTI PAGE
    // =========================
    if (VIDARA_KEY) {
      const pages = [1, 2, 3, 4, 5] // ambil 500 video

      const requests = pages.map(page =>
        fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_KEY}&page=${page}`)
          .then(r => r.json())
          .catch(() => null)
      )

      const results = await Promise.all(requests)

      results.forEach(r => {
        const vids = r?.result?.videos || []
        const formatted = vids.map(v => ({
          title: v.title || "Untitled",
          thumbnail: v.thumbnail || "",
          filecode: v.filecode,
          source: "vidara"
        }))

        allVideos.push(...formatted)
      })
    }

    // =========================
    // RANDOM BIAR VARIATIF
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
