export default async function handler(req, res) {

  try {

    const page = Number(req.query.page || 1);

    const API_KEY = process.env.VIZEY_API_KEY;

    // 🔥 ambil semua folder
    const folderRes = await fetch(
      `https://vizey.net/api/v1/folders?apikey=${API_KEY}&_=${Date.now()}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Cache-Control": "no-cache"
        }
      }
    );

    const folderData = await folderRes.json();

    const folders = folderData.data || [];

    let allVideos = [];

    // 🔥 loop semua folder
    for (const folder of folders) {

      const folderId = folder.id;

      const videoRes = await fetch(
        `https://vizey.net/api/v1/folders/${folderId}?apikey=${API_KEY}&page=${page}&_=${Date.now()}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Cache-Control": "no-cache"
          }
        }
      );

      const videoData = await videoRes.json();

      const videos = videoData.data || [];

      allVideos.push(...videos);
    }

    // 🔥 hapus duplicate
    const uniqueVideos = [];

    const ids = new Set();

    for (const v of allVideos) {

      if (!ids.has(v.id)) {

        ids.add(v.id);

        uniqueVideos.push(v);
      }
    }

    res.setHeader(
      "Cache-Control",
      "no-store, max-age=0"
    );

    return res.status(200).json({
      success: true,
      page,
      total: uniqueVideos.length,
      videos: uniqueVideos,
      hasNext: uniqueVideos.length > 0
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.toString()
    });

  }

}
