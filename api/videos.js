export export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIDARA_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API KEY KOSONG" });
    }

    const response = await fetch(
      `https://api.vidara.so/v1/file/list?api_key=${API_KEY}`
    );

    const data = await response.json();

    // 🔥 FIX DI SINI
    const videos = data?.result?.files || [];

    return res.status(200).json({ videos });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
