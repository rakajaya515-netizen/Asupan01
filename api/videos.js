export default async function handler(req, res) {

  try {

    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];

    // 🔥 paksa ambil banyak halaman
    for (let page = 1; page <= 50; page++) {

      console.log("LOAD PAGE:", page);

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

      // 🔥 kalau page kosong baru stop
      if (videos.length === 0) {
        break;
      }

      allVideos.push(...videos);

      // 🔥 delay kecil anti rate limit
      await new Promise(r => setTimeout(r, 150));
    }

    // 🔥 hapus duplicate
    const unique = [];
    const ids = new Set();

    for (const v of allVideos) {

      if (!ids.has(v.id)) {

        ids.add(v.id);

        unique.push(v);
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
