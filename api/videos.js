async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    // batch:
    // 1 = page 1-5
    // 2 = page 6-10
    // dst

    const batch = Number(req.query.batch || 1);

    const startPage = (batch - 1) * 5 + 1;
    const endPage = startPage + 4;

    let videos = [];
    const used = new Set();

    for (let page = startPage; page <= endPage; page++) {

      try {

        const data = await fetchJson(
          `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`
        );

        const pageVideos = data.data || [];

        pageVideos.forEach(v => {

          const video = {
            id: v.id,
            title: v.title || "No title",
            thumbnail: v.thumbnail,
            url: `https://vizey.net/d/${v.id}`,
            source: "vizey"
          };

          // hapus duplicate
          if (!used.has(video.url)) {
            used.add(video.url);
            videos.push(video);
          }

        });

      } catch (err) {
        console.log("PAGE ERROR", page);
      }
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );

    return res.status(200).json({
      success: true,
      batch,
      videos
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}
