export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIDARA_API_KEY;

    const page = parseInt(req.query.page || "1");
    const limit = 20;

    const response = await fetch(
      `https://api.vidara.so/v1/file/list?api_key=${API_KEY}`
    );

    const data = await response.json();

    const start = (page - 1) * limit;
    const end = start + limit;

    const videos = data.result.files.slice(start, end).map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      filecode: v.filecode
    }));

    res.status(200).json({ videos });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
