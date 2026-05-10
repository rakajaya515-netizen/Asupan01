export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  const page = Number(req.query.page || 1);

  try {
    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`
    );

    const data = await response.json();

    const videos = data?.data || [];

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    res.status(200).json({
      page,
      videos,
      hasMore: data?.pagination?.hasNext || false,
    });

  } catch (err) {
    res.status(500).json({
      error: "Gagal ambil data Vizey",
    });
  }
}
