export default async function handler(req, res) {

  try {

    const API_KEY =
      process.env.VIZEY_API_KEY;

    // 🔥 folder id kamu
    const FOLDER_ID = "089vwlwk";

    let allVideos = [];

    // 🔥 ambil SEMUA halaman
    for (let page = 1; page <= 100; page++) {

      const url =
        `https://vizey.net/api/v1/folders/${FOLDER_ID}?apikey=${API_KEY}&page=${page}&t=${Date.now()}`;

      console.log("FETCH:", url);

      const response =
        await fetch(url);

      const json =
        await response.json();

      console.log(json);

      // 🔥 array video
      const videos =
        json.data || [];

      // stop kalau kosong
      if (!videos.length) {
        break;
      }

      allVideos.push(...videos);

      // delay anti rate limit
      await new Promise(r =>
        setTimeout(r, 150)
      );
    }

    // 🔥 remove duplicate
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
      "no-store, max-age=0"
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
