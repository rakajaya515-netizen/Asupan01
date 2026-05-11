export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY

    if (!API_KEY) {
      return Response.json({
        success: false,
        error: "API KEY NOT FOUND",
      })
    }

    let page = 1
    let hasNext = true

    let allVideos = []

    while (hasNext) {
      const res = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`,
        {
          cache: "no-store",
        }
      )

      const json = await res.json()

      console.log(json)

      if (!json.success) {
        return Response.json(json)
      }

      allVideos.push(...json.data)

      hasNext = json.pagination?.hasNext || false

      page++
    }

    return Response.json({
      success: true,
      total: allVideos.length,
      videos: allVideos,
    })
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    })
  }
}
