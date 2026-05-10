async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) return null;

    return await res.json();

  } catch {
    return null;
  }
}

export default async function handler(req, res) {

  const API_KEY = process.env.VIZEY_API_KEY;

  let videos = [];
  const used = new Set();

  let currentPage = 1;
  let totalPages = 1;

  // LOOP SEMUA PAGE
  while (currentPage <= totalPages) {

    const data = await fetchJson(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${currentPage}`
    );

    if (!data) {
      currentPage++;
      continue;
    }

    // update total page dari API
    totalPages =
      data.pagination?.totalPages || 1;

    const list = data.data || [];

    // ambil semua video
    for (const item of list) {

      if (!item?.id) continue;

      const url = `https://vizey.net/v/${item.id}`;

      // hapus duplicate
      if (used.has(url)) continue;

      used.add(url);

      videos.push({
        id: item.id,
        title: item.title || "No title",
        thumbnail: item.thumbnail,
        url,
        source: "vizey",
        createdAt: item.createdAt || ""
      });
    }

    currentPage++;
  }

  // video terbaru di atas
  videos.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // cache vercel
  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  return res.status(200).json(videos);
}
