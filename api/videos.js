export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIDARA_API_KEY;

    const response = await fetch(
      `https://api.vidara.so/v1/file/list?api_key=${API_KEY}`
    );

    const data = await response.json();

    res.status(200).json({
      videos: data.result.files
    });

  } catch (err) {
    res.status(500).json({ error: "Gagal ambil video" });
  }
}
