export default async function handler(req, res) {

  try {

    const API_KEY =
      process.env.VIZEY_API_KEY;

    const FOLDER_ID =
      "089vwlwk";

    let allVideos = [];

    let currentPage = 1;

    let hasNext = true;

    while (hasNext) {

      const response = await fetch(
        `https://vizey.net/api/v1/folders/${FOLDER_ID}?apikey=${API_KEY}&page=${currentPage}&_=${Date.now()}`
      );

      const json = await response.json();

      console.log(json);

      const videos = json.data || [];

      const pagination =
        json.pagination || {};

      allVideos.push(...videos);

      // 🔥 cek next page
      hasNext =
        pagination.hasNext || false;

      currentPage++;

      await new Promise(r =>
        setTimeout(r, 120)
      );
    }

    // remove duplicate
    const unique = [];

    const ids = new Set();

    for (const video of allVideos) {

      if (!ids.has(video.id)) {

        ids.add(video.id);

        unique.push(video);

      }

    }

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res.status(200).json({
      success: true,
      total: unique.length,
      videos: unique
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.toString()
    });

  }

}
