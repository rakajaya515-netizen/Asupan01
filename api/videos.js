export default async function handler(req, res) {

  try {

    const API_KEY =
      process.env.VIZEY_API_KEY;

    const FOLDER_ID =
      "089vwlwk";

    let allVideos = [];

    for (let page = 1; page <= 100; page++) {

      const response = await fetch(
        `https://vizey.net/api/v1/folders/${FOLDER_ID}/videos?apikey=${API_KEY}&page=${page}&t=${Date.now()}`
      );

      const json =
        await response.json();

      console.log("PAGE:", page);

      console.log(json);

      const videos =
        json.data || [];

      if (!videos.length) {
        break;
      }

      allVideos.push(...videos);

      await new Promise(r =>
        setTimeout(r, 100)
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
