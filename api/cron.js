export default async function handler(req, res) {
  try {
    await fetch("https://asupan01.vercel.app/api/videos")
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
