export default async function handler(req, res) {
  try {
    const apiKey = process.env.VIDARA_KEY;

    const response = await fetch(`https://vidara.site/api?key=${apiKey}`);
    const data = await response.json();

    // sesuaikan dengan struktur API asli
    const list = data.result || data.data || [];

    const videos = list.map(item => ({
      title: item.title || item.caption,
      thumbnail: item.thumbnail || item.thumb,
      url: item.url || item.link
    }));

    res.status(200).json({ videos });

  } catch (err) {
    res.status(500).json({ error: "API error", detail: err.message });
  }
}
