async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}

export default async function handler(req, res) {

  try {

    const API_KEY = process.env.VIZEY_API_KEY;

    const page = Number(req.query.page || 1);

    const data = await fetchJson(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`
    );

    const videos = (data.data || []).map(v => ({
      id: v.id,
      title: v.title || "No title",
      thumbnail: v.thumbnail,
      url: `https://vizey.net/d/${v.id}`,
      source: "vizey"
    }));

    return res.status(200).json({
      success: true,
      page,
      hasNext: data.pagination?.hasNext || false,
      totalPages: data.pagination?.totalPages || 1,
      videos
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}
