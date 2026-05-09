async function fetchJson(url, timeout = 10000) {
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.log("FETCH ERROR:", err.message);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    let allVideos = [];

    // =========================
    // VIZEY FIRST
    // =========================

    try {
      for (let page = 1; page <= 20; page++) {
        const data = await fetchJson(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        if (!data || !data.data || data.data.length === 0) {
          break;
        }

        const videos = data.data.map((video) => ({
          title: video.title || "No Title",

          thumbnail:
            video.thumbnail ||
            "https://placehold.co/400x600",

          url: `https://vizey.net/v/${video.id}`,

          source: "vizey",
        }));

        allVideos.push(...videos);
      }
    } catch (err) {
      console.log("VIZEY ERROR:", err.message);
    }

    // =========================
    // DOODSTREAM BELOW
    // =========================

    try {
      const dood = await fetchJson(
        `https://doodapi.co/api/file/list?key=${DOOD_API}&page=1`
      );

      if (dood?.result?.files) {
        const doodVideos = dood.result.files.map((video) => ({
          title: video.title || "No Title",

          thumbnail:
            video.splash_img ||
            video.single_img ||
            "https://placehold.co/400x600",

          url:
            video.download_url ||
            video.protected_embed ||
            "#",

          source: "dood",
        }));

        allVideos.push(...doodVideos);
      }
    } catch (err) {
      console.log("DOOD ERROR:", err.message);
    }

    // =========================
    // REMOVE DUPLICATE
    // =========================

    const unique = [];
    const urls = new Set();

    for (const video of allVideos) {
      if (!urls.has(video.url)) {
        urls.add(video.url);
        unique.push(video);
      }
    }

    return res.status(200).json({
      success: true,
      total: unique.length,
      videos: unique,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
      videos: [],
    });
  }
}
