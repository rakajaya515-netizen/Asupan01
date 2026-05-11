let cache = {};

export default async function handler(req, res) {

  const page =
    Number(req.query.page || 1);

  // 🔥 cache 60 detik
  const cacheKey = `page-${page}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].time < 60000
  ) {

    return res.status(200).json(
      cache[cacheKey].data
    );

  }

  try {

    const response = await fetch(
      `https://api.vizey.com/video/list?page=${page}`,
      {
        headers: {
          accept: "application/json"
        }
      }
    );

    const json =
      await response.json();

    // 🔥 ambil video saja
    const videos =
      (json.result || [])
      .slice(0, 20)
      .map(v => ({

        id:
          v.filecode ||
          v.id,

        title:
          v.title ||
          "Untitled Video",

        thumbnail:
          v.thumbnail ||
          "",

      }));

    const result = {
      videos,
      hasMore:
        videos.length > 0
    };

    // 🔥 simpan cache
    cache[cacheKey] = {
      time: Date.now(),
      data: result
    };

    // 🔥 header cache browser
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );

    return res
      .status(200)
      .json(result);

  } catch (err) {

    return res.status(500).json({
      videos: [],
      hasMore: false
    });

  }

}
