export default async function handler(req, res) {

  try {

    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];

    // 🔥 ambil banyak halaman sekaligus
    for (let page = 1; page <= 20; page++) {

      const response = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}&_=${Date.now()}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Cache-Control": "no-cache"
          }
        }
      );

      const data = await response.json();

      const videos = data.data || [];

      // 🔥 stop kalau page kosong
      if (videos.length === 0) {
        break;
      }

      allVideos.push(...videos);

      // 🔥 stop kalau tidak ada next page
      if (
        data.pagination &&
        data.pagination.hasNext === false
      ) {
        break;
      }
    }

    // 🔥 hapus duplicate
    const uniqueVideos = [];

    const ids = new Set();

    for (const video of allVideos) {

      if (!ids.has(video.id)) {

        ids.add(video.id);

        uniqueVideos.push(video);
      }
    }

    res.setHeader(
      "Cache-Control",
      "no-store, max-age=0"
    );

    return res.status(200).json({
      success: true,
      total: uniqueVideos.length,
      videos: uniqueVideos
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.toString()
    });

  }

}
