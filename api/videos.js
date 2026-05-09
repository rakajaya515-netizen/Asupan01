async function fetchWithTimeout(url, timeout = 15000) {
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const response = await fetch(url, {
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
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
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const vizeyRes = await fetchWithTimeout(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        const vizeyJson = await vizeyRes.json();

        const videos = (vizeyJson.data || [])
          .filter((v) => v.id)
          .map((video) => ({
            title: video.title || "No Title",

            thumbnail:
              video.thumbnail ||
              "https://placehold.co/400x600",

            // LINK ASLI VIZEY
            url: `https://vizey.net/v/${video.id}`,

            source: "vizey",
          }));

        allVideos.push(...videos);

        console.log(
          `VIZEY PAGE ${page}: ${videos.length}`
        );

        // kalau data kosong stop
        if (!vizeyJson.data || vizeyJson.data.length === 0) {
          hasMore = false;
        } else {
          page++;
        }

        // LIMIT BIAR SERVER VERSEL TIDAK CRASH
        if (page > 100) {
          hasMore = false;
        }
      }
    } catch (err) {
      console.log("VIZEY ERROR:", err);
    }

    // =========================
    // DOODSTREAM BELOW
    // =========================

    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const doodRes = await fetchWithTimeout(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
        );

        const doodJson = await doodRes.json();

        const videos = (doodJson.result?.files || [])
          .map((video) => ({
            title: video.title || "No Title",

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

        allVideos.push(...videos);

        console.log(
          `DOOD PAGE ${page}: ${videos.length}`
        );

        // stop kalau kosong
        if (
          !doodJson.result?.files ||
          doodJson.result.files.length === 0
        ) {
          hasMore = false;
        } else {
          page++;
        }

        // limit biar tidak timeout
        if (page > 100) {
          hasMore = false;
        }
      }
    } catch (err) {
      console.log("DOOD ERROR:", err);
    }

    // HAPUS DUPLIKAT
    const uniqueVideos = [
      ...new Map(
        allVideos.map((item) => [item.url, item])
      ).values(),
    ];

    // VIZEY PALING ATAS
    uniqueVideos.sort((a, b) => {
      if (a.source === "vizey" && b.source !== "vizey") {
        return -1;
      }

      if (a.source !== "vizey" && b.source === "vizey") {
        return 1;
      }

      return 0;
    });

    res.status(200).json(uniqueVideos);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "FAILED_LOAD_VIDEOS",
    });
  }
}
