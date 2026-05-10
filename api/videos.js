async function fetchJson(url, timeout = 10000) {
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    clearTimeout(id);

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {

  const VIZEY_API = process.env.VIZEY_API_KEY;
  const DOOD_API = process.env.DOOD_API_KEY;

  let videos = [];
  const used = new Set();

  // =========================
  // VIZEY
  // =========================

  for (let page = 1; page <= 50; page++) {

    const data = await fetchJson(
      `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
    );

    if (!data || !data.data) continue;

    const pageVideos = data.data;

    for (const v of pageVideos) {

      if (!v?.id) continue;

      const url = `https://vizey.net/v/${v.id}`;

      if (used.has(url)) continue;

      used.add(url);

      videos.push({
        id: `v-${v.id}`,
        title: v.title || "No title",
        thumbnail: v.thumbnail,
        url,
        source: "vizey"
      });
    }
  }

  // =========================
  // DOOD
  // =========================

  for (let page = 1; page <= 30; page++) {

    const data = await fetchJson(
      `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
    );

    if (!data?.result?.files) continue;

    const pageVideos = data.result.files;

    for (const v of pageVideos) {

      if (!v?.file_code) continue;

      const url = `https://dood.so/e/${v.file_code}`;

      if (used.has(url)) continue;

      used.add(url);

      videos.push({
        id: `d-${v.file_code}`,
        title: v.title || "No title",
        thumbnail: v.splash_img,
        url,
        source: "dood"
      });
    }
  }

  // =========================
  // SORT TERBARU
  // =========================

  videos.reverse();

  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  return res.status(200).json(videos);
}
