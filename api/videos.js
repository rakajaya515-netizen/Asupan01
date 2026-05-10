async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();

  } catch {
    return null;
  }
}

export default async function handler(req, res) {

  const API_KEY = process.env.VIZEY_API_KEY;

  let videos = [];
  let used = new Set();

  // ambil page banyak
  for (let page = 1; page <= 100; page++) {

    const data = await fetchJson(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`
    );

    // skip jika gagal
    if (!data) continue;

    // cek array video
    const list = data.data || data.result || [];

    // kalau page kosong lanjut
    if (!Array.isArray(list)) continue;

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
        source: "vizey"
      });
    }
  }

  // terbaru di atas
  videos.reverse();

  // cache vercel
  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  return res.status(200).json(videos);
}
