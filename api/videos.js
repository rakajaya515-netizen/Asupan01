async function fetchWithTimeout(url, timeout = 10000) {
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

    // API KEYS
    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    const DOOD_API =
      process.env.DOOD_API_KEY;

    // VIDEO STORAGE
    let vizeyVideos = [];
    let doodVideos = [];



    // =========================
    // VIZEY FIRST
    // =========================

    try {

      const vizeyRes =
        await fetchWithTimeout(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=1`
        );

      const vizeyJson =
        await vizeyRes.json();

      console.log("VIZEY:", vizeyJson);

      vizeyVideos =
        (vizeyJson.data || [])
          .filter(v => v.id)
          .map(video => ({

            title:
              video.title || "No Title",

            thumbnail:
              video.thumbnail ||
              "https://placehold.co/400x600",

            // LINK VIDEO
            url:
              `https://vizey.net/v/${video.id}`,

            source:
              "vizey"

          }));

    } catch (err) {

      console.log(
        "VIZEY ERROR:",
        err
      );

    }



    // =========================
    // DOODSTREAM
    // =========================

    try {

      const doodRes =
        await fetchWithTimeout(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=1`
        );

      const doodJson =
        await doodRes.json();

      console.log("DOOD:", doodJson);

      doodVideos =
        (doodJson.result?.files || [])
          .map(video => ({

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

            source:
              "doodstream"

          }));

    } catch (err) {

      console.log(
        "DOOD ERROR:",
        err
      );

    }



    // =========================
    // FINAL VIDEO LIST
    // VIZEY PALING ATAS
    // =========================

    const videos = [

      ...vizeyVideos,

      ...doodVideos

    ];



    // HAPUS DUPLIKAT
    const uniqueVideos =
      videos.filter(
        (video, index, self) =>
          index ===
          self.findIndex(
            v => v.url === video.url
          )
      );



    return res.status(200).json(
      uniqueVideos
    );

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: "Internal Server Error"
    });

  }
}
