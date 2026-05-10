export default async function handler(req, res) {

  const VIZEY_API = process.env.VIZEY_API_KEY;
  const DOOD_API = process.env.DOOD_API_KEY;

  try {

    let allVideos = [];

    // =========================
    // VIZEY MULTI PAGE
    // =========================

    for (let page = 1; page <= 20; page++) {

      try {

        const response = await fetch(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        const data = await response.json();

        const videos = (data.data || []).map(v => ({
          title: v.title || "No Title",
          thumbnail: v.thumbnail,
          url: v.url,
          source: "vizey"
        }));

        allVideos.push(...videos);

      } catch (err) {
        console.log("VIZEY PAGE ERROR:", page);
      }

    }

    // =========================
    // DOOD MULTI PAGE
    // =========================

    for (let page = 1; page <= 20; page++) {

      try {

        const response = await fetch(
          `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
        );

        const data = await response.json();

        const files = data.result?.files || [];

        const videos = files.map(v => ({
          title: v.title || "No Title",
          thumbnail: v.splash_img,
          url: `https://dood.so/e/${v.file_code}`,
          source: "dood"
        }));

        allVideos.push(...videos);

      } catch (err) {
        console.log("DOOD PAGE ERROR:", page);
      }

    }

    // =========================
    // HAPUS VIDEO DUPLIKAT
    // =========================

    const seen = new Set();

    const uniqueVideos = allVideos.filter(video => {

      if (!video.url) return false;

      if (seen.has(video.url)) {
        return false;
      }

      seen.add(video.url);

      return true;

    });

    // =========================
    // RESPONSE
    // =========================

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );

    res.status(200).json(uniqueVideos);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed load videos"
    });

  }

}
