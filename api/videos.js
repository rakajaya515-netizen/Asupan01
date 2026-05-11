export default async function handler(req, res) {

  try {

    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];

    // =========================
    // 🔥 AMBIL VIDEO ROOT
    // =========================

    for (let page = 1; page <= 20; page++) {

      const rootRes = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}&_=${Date.now()}`
      );

      const rootData = await rootRes.json();

      const rootVideos = rootData.data || [];

      if (rootVideos.length === 0) break;

      allVideos.push(...rootVideos);
    }

    // =========================
    // 🔥 AMBIL SEMUA FOLDER
    // =========================

    const folderRes = await fetch(
      `https://vizey.net/api/v1/folders?apikey=${API_KEY}&_=${Date.now()}`
    );

    const folderData = await folderRes.json();

    const folders = folderData.data || [];

    // =========================
    // 🔥 LOOP SEMUA FOLDER
    // =========================

    for (const folder of folders) {

      for (let page = 1; page <= 20; page++) {

        const resFolderVideos = await fetch(
          `https://vizey.net/api/v1/folders/${folder.id}?apikey=${API_KEY}&page=${page}&_=${Date.now()}`
        );

        const folderVideosData =
          await resFolderVideos.json();

        const videos =
          folderVideosData.data || [];

        if (videos.length === 0) break;

        allVideos.push(...videos);
      }
    }

    // =========================
    // 🔥 HAPUS DUPLICATE
    // =========================

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
