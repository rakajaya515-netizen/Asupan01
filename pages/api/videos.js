export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY

  try {
    const url = `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=5`

    const response = await fetch(url)
    const text = await response.text()

    return res.status(200).send({
      api_key: API_KEY || "KOSONG",
      raw: text
    })

  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}
