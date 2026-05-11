export default async function handler(req, res) {

  try {

    const API_KEY = process.env.VIZEY_API_KEY;

    const FOLDER_ID = "089vwlwk";

    let allVideos = [];

    // 🔥 ambil semua halaman folder
    for (let page = 1; page <= 100; page++) {

      console.log("LOAD PAGE:", page);

      const response = await fetch(
        `https://vizey.net/api/v1/folders/${FOLDER_ID}?apikey=${API_KEY}&page=${page}&_=${Date.now()}`
      );

      const data = await response.json();

      const videos = data.data || [];

      console.log(
        "VIDEOS:",
        videos.length
      );

      // stop kalau kosong
      if (videos.length === 0) {
        break;
      }

      allVideos.push(...videos);

      // anti rate limit
      await new Promise(r =>
        setTimeout(r, 100)
      );
    }

    // 🔥 hapus duplicate
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
