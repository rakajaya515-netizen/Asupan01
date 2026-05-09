async function fetchJson(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const VIZEY_API = process.env.VIZEY_API_KEY;
    const DOOD_API = process.env.DOOD_API_KEY;

    let allVideos = [];

    // ====================================
    // VIZEY
    // ====================================

    try {
      let page = 1;
      let finished = false;

      while (!finished) {
        console.log("VIZEY PAGE:", page);

        const json = await fetchJson(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

        // stop kalau gagal
        if (!json || !json.data) {
          finished = true;
          break;
        }

        // stop kalau kosong
        if (json.data.length === 0) {
          finished = true;
          break;
        }

        const videos = json.data
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

        allVideos.push(...videos);

        page++;

        // delay kecil anti rate limit
        await new Promise((r) =>
          setTimeout(r, 150)
        );

        // safety limit
        if (page > 1000) {
          finished = true;
        }
      }
    } catch (err) {
      console.log("VIZEY ERROR:", err);
    }

    // ====================================
    // DOODSTREAM
    // ====================================

    try {
      let page = 1;
      let finished = false;

      while (!finished) {
        console.log("DOOD PAGE:", page);

        const json = await fetchJson(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
        );

        const files =
          json?.result?.files || [];

        if (files.length === 0) {
          finished = true;
          break;
        }

        const videos = files.map(
          (video) => ({
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
          })
        );

        allVideos.push(...videos);

        page++;

        await new Promise((r) =>
          setTimeout(r, 150)
        );

        // safety limit
        if (page > 1000) {
          finished = true;
        }
      }
    } catch (err) {
      console.log("DOOD ERROR:", err);
    }

    // ====================================
    // HAPUS DUPLIKAT
    // ====================================

    const uniqueVideos = [
      ...new Map(
        allVideos.map((v) => [v.url, v])
      ).values(),
    ];

    // ====================================
    // VIZEY PALING ATAS
    // ====================================

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
