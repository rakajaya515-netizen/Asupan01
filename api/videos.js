export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIDARA_API_KEY;

    const response = await fetch(
      `https://api.vidara.so/v1/file/list?api_key=${API_KEY}`
    );

    const data = await response.json();

    const videos = data.result.files.map(v => ({
      title: v.title || "No Title",
      filecode: v.file_code,
      thumbnail: v.thumbnail || `https://img.vidara.so/${v.file_code}.jpg`
    }));

    res.status(200).json({ videos });

  } catch (err) {
    res.status(500).json({ error: "Gagal ambil video" });
  }
}
