async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Fetch failed");
  }

  return res.json();
}

export default async function handler(req, res) {
  try {
    const page = Number(req.query.page || 1);

    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    let videos = [];
    const used = new Set();

    // =====================
    // VIZEY
    // =====================

    try {
      const data = await fetchJson(
        `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
      );

      const vizeyVideos = (data.data || []).map((v) => ({
        id: `v-${v.id}`,
        title: v.title || "No title",
        thumbnail: v.thumbnail,
        url: `https://vizey.net/v/${v.id}`,
        source: "vizey",
      }));

      vizeyVideos.forEach((v) => {
        if (!used.has(v.url)) {
          used.add(v.url);
          videos.push(v);
        }
      });
    } catch (err) {
      console.log("VIZEY ERROR");
    }

    // =====================
    // DOOD
    // =====================

    try {
      const data = await fetchJson(
        `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
      );

      const doodVideos = (data.result?.files || []).map((v) => ({
        id: `d-${v.file_code}`,
        title: v.title || "No title",
        thumbnail: v.splash_img,
        url: `https://dood.so/e/${v.file_code}`,
        source: "dood",
      }));

      doodVideos.forEach((v) => {
        if (!used.has(v.url)) {
          used.add(v.url);
          videos.push(v);
        }
      });
    } catch (err) {
      console.log("DOOD ERROR");
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    return res.status(200).json({
      page,
      videos,
      hasMore: videos.length > 0,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed load videos",
    });
  }
}
