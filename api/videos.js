async function fetchJson(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    // PAGE DARI FRONTEND
    const page = Number(req.query.page || 1);

    let videos = [];

    // =========================
    // VIZEY
    // =========================

    try {
      const vizeyJson = await fetchJson(
        `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
      );

      const vizeyVideos = (vizeyJson?.data || [])
        .filter((v) => v.id)
        .map((video) => ({
          title:
            video.title || "No Title",

          thumbnail:
            video.thumbnail ||
            "https://placehold.co/400x600",

          url:
            `https://vizey.net/v/${video.id}`,

          source: "vizey",
        }));

      videos.push(...vizeyVideos);
    } catch (err) {
      console.log("VIZEY ERROR:", err);
    }

    // =========================
    // DOOD
    // =========================

    try {
      const doodJson = await fetchJson(
        `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
      );

      const doodVideos = (
        doodJson?.result?.files || []
      ).map((video) => ({
        title:
          video.title || "No Title",

        thumbnail:
          video.splash_img ||
          video.single_img ||
          "https://placehold.co/400x600",

        url:
          video.download_url ||
          video.protected_embed ||
          "#",

        source: "doodstream",
      }));

      videos.push(...doodVideos);
    } catch (err) {
      console.log("DOOD ERROR:", err);
    }

    // HAPUS DUPLIKAT
    const uniqueVideos = [
      ...new Map(
        videos.map((v) => [v.url, v])
      ).values(),
    ];

    // VIZEY DI ATAS
    uniqueVideos.sort((a, b) => {
      if (
        a.source === "vizey" &&
        b.source !== "vizey"
      ) {
        return -1;
      }

      if (
        a.source !== "vizey" &&
        b.source === "vizey"
      ) {
        return 1;
      }

      return 0;
    });

    res.status(200).json({
      page,
      total: uniqueVideos.length,
      videos: uniqueVideos,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "FAILED_LOAD_VIDEOS",
    });
  }
}
