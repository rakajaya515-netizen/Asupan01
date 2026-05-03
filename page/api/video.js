export default async function handler(req, res) {
  const { filecode } = req.query
  const API_KEY = process.env.API_KEY

  if (!filecode) {
    return res.status(400).json({ error: "filecode kosong" })
  }

  try {
    const url = `https://api.vidara.so/v1/video/info?api_key=${API_KEY}&filecode=${filecode}`

    const response = await fetch(url)
    const data = await response.json()

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
