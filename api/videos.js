async function fetchPage(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Fetch error");
  }

  return res.json();
}

export default async function handler(req, res) {
  try {
    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    let allVideos = [];

    // =========================
    // VIZEY
    // =========================

    for (let page = 1; page <= 30; page++) {
      try {
        const data = await fetchPage(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        const videos = (data.data || [])
          .slice(0, 12) // ambil 12 video tiap page
          .map((v) => ({
            id: `vizey-${v.id}`,
            title: v.title || "No title",
            thumbnail: v.thumbnail,
            url: `https://vizey.net/v/${v.id}`,
            source: "vizey",
          }));

        if (videos.length === 0) break;

        allVideos.push(...videos);
      } catch (err) {
        console.log("VIZEY PAGE ERROR:", page);
      }
    }

    // =========================
    // DOOD
    // =========================

    for (let page = 1; page <= 30; page++) {
      try {
        const data = await fetchPage(
          `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
        );

        const videos = (data.result?.files || [])
          .slice(0, 12)
          .map((v) => ({
            id: `dood-${v.file_code}`,
            title: v.title || "No title",
            thumbnail: v.splash_img,
            url: `https://dood.so/e/${v.file_code}`,
            source: "dood",
          }));

        if (videos.length === 0) break;

        allVideos.push(...videos);
      } catch (err) {
        console.log("DOOD PAGE ERROR:", page);
      }
    }

    // TANPA ACAK
    // urutan tetap sesuai page

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    return res.status(200).json(allVideos);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: "Failed load videos",
    });
  }
}
