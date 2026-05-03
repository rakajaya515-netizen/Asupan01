export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY tidak ada" })
  }

  try {
    const url = `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`

    const response = await fetch(url)
    const data = await response.json()

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
