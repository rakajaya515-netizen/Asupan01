export default async function handler(req, res) {

  try {

    const API_KEY =
      process.env.VIZEY_API_KEY;

    let page = 1;

    let allVideos = [];

    let hasNext = true;

    while (hasNext) {

      const response = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}&t=${Date.now()}`
      );

      const json =
        await response.json();

      console.log("PAGE:", page);

      console.log(json);

      const videos =
        json.data || [];

      allVideos.push(...videos);

      // pagination
      hasNext =
        json.pagination?.hasNext || false;

      page++;

      await new Promise(r =>
        setTimeout(r, 150)
      );
    }

    // remove duplicates
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
