export default async function handler(req, res) {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";

    const [vidaraRes, vizeyRes] = await Promise.all([
      fetch(`${process.env.VIDARA_API}?page=${page}&search=${search}`),
      fetch(`${process.env.VIZEY_API}?page=${page}&search=${search}`)
    ]);

    const vidara = await vidaraRes.json();
    const vizey = await vizeyRes.json();

    const formatVidara = (vidara.data || []).map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      link: v.link
    }));

    const formatVizey = (vizey.data || []).map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      link: v.link
    }));

    const combined = [...formatVidara, ...formatVizey];

    res.status(200).json(combined);

  } catch (e) {
    res.status(500).json({ error: "API error", detail: e.message });
  }
}
