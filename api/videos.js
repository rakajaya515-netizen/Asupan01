// api/videos.js

let cache = {};

export default async function handler(req, res) {

  // 🔥 ambil page
  const page =
    Number(req.query.page || 1);

  // 🔥 cache key
  const cacheKey =
    `page-${page}`;

  // 🔥 cache 60 detik
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].time < 60000
  ) {

    return res.status(200).json(
      cache[cacheKey].data
    );

  }

  try {

    // 🔥 fetch API Vizey
    const response =
      await fetch(
        `https://vizey.net/api/v1/list?page=${page}`,
        {
          headers:{
            accept:"application/json"
          }
        }
      );

    const json =
      await response.json();

    // 🔥 data video
    const rawVideos =
      json?.data || [];

    // 🔥 limit biar ringan
    const videos =
      rawVideos
      .slice(0,20)
      .map(v => ({

        id:
          v.id ||
          v.filecode,

        title:
          v.title ||
          "Untitled Video",

        thumbnail:
          v.thumbnail ||
          "",

      }));


    // 🔥 cek next page
    const hasMore =
      Boolean(
        json?.pagination?.hasNext
      );


    // 🔥 result
    const result = {

      videos,

      hasMore

    };


    // 🔥 simpan cache
    cache[cacheKey] = {

      time: Date.now(),

      data: result

    };


    // 🔥 browser cache
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=120"
    );


    // 🔥 kirim response
    return res
      .status(200)
      .json(result);

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      videos: [],

      hasMore: false

    });

  }

}
