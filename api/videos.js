async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Fetch failed");
  }

  return res.json();
}

export default async function handler(req, res) {
  try {
    const batch = Number(req.query.batch || 1);

    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    let videos = [];

    const used = new Set();

    // batch:
    // 1 = page 1-5
    // 2 = page 6-10
    // 3 = page 11-15

    const startPage = (batch - 1) * 5 + 1;
    const endPage = startPage + 4;

    // ======================
    // VIZEY
    // ======================

    for (let page = startPage; page <= endPage; page++) {
      try {
        const data = await fetchJson(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        const pageVideos = (data.data || []).map((v) => ({
          id: `v-${v.id}`,
          title: v.title || "No title",
          thumbnail: v.thumbnail,
          url: `https://vizey.net/d/${v.id}`,
          source: "vizey",
        }));

        pageVideos.forEach((video) => {
          if (!used.has(video.url)) {
            used.add(video.url);

            videos.push(video);
          }
        });
      } catch (err) {
        console.log("VIZEY ERROR PAGE:", page);
      }
    }

    // ======================
    // DOOD
    // ======================

    for (let page = startPage; page <= endPage; page++) {
      try {
        const data = await fetchJson(
          `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
        );

        const pageVideos = (data.result?.files || []).map((v) => ({
          id: `d-${v.file_code}`,
          title: v.title || "No title",
          thumbnail: v.splash_img,
          url: `https://dood.so/e/${v.file_code}`,
          source: "dood",
        }));

        pageVideos.forEach((video) => {
          if (!used.has(video.url)) {
            used.add(video.url);

            videos.push(video);
          }
        });
      } catch (err) {
        console.log("DOOD ERROR PAGE:", page);
      }
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
