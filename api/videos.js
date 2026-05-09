async function fetchJson(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (e) {
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
      // AMBIL 20 HALAMAN SEKALIGUS
      const pages = Array.from(
        { length: 20 },
        (_, i) => i + 1
      );

      const responses = await Promise.all(
        pages.map((page) =>
          fetchJson(
            `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
          )
        )
      );

      responses.forEach((json) => {
        if (!json?.data) return;

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
      });

      console.log(
        "TOTAL VIZEY:",
        allVideos.length
      );
    } catch (err) {
      console.log("VIZEY ERROR:", err);
    }

    // =========================
    // DOODSTREAM BELOW
    // =========================

    try {
      const pages = Array.from(
        { length: 20 },
        (_, i) => i + 1
      );

      const responses = await Promise.all(
        pages.map((page) =>
          fetchJson(
            `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
          )
        )
      );

      responses.forEach((json) => {
        const files =
          json?.result?.files || [];

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
      });

      console.log(
        "TOTAL ALL:",
        allVideos.length
      );
    } catch (err) {
      console.log("DOOD ERROR:", err);
    }

    // HAPUS DUPLIKAT
    const uniqueVideos = [
      ...new Map(
        allVideos.map((v) => [v.url, v])
      ).values(),
    ];

    // VIZEY PALING ATAS
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

    res.status(200).json(uniqueVideos);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "FAILED_LOAD_VIDEOS",
    });
  }
        }
