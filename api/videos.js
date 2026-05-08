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

    // =========================
    // API KEYS
    // =========================

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    const DOOD_API =
      process.env.DOOD_API_KEY;



    // =========================
    // VIDEO STORAGE
    // =========================

    let vizeyVideos = [];
    let doodVideos = [];



    // =========================
    // VIZEY MULTI PAGE
    // =========================

    for (let page = 1; page <= 10; page++) {

      try {

        const vizeyRes =
          await fetchWithTimeout(
            `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
          );

        const vizeyJson =
          await vizeyRes.json();

        console.log(
          "VIZEY PAGE:",
          page
        );

        const newVideos =
          (vizeyJson.data || [])
            .filter(v => v.id)
            .map(video => ({

              title:
                video.title || "No Title",

              thumbnail:
                video.thumbnail ||
                "https://placehold.co/400x600",

              url:
                `https://vizey.net/d/${video.id}`,

              source:
                "vizey"

            }));

        vizeyVideos.push(
          ...newVideos
        );

      } catch (err) {

        console.log(
          "VIZEY ERROR PAGE:",
          page,
          err
        );

      }

    }



    // =========================
    // DOODSTREAM MULTI PAGE
    // =========================

    for (let page = 1; page <= 10; page++) {

      try {

        const doodRes =
          await fetchWithTimeout(
            `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
          );

        const doodJson =
          await doodRes.json();

        console.log(
          "DOOD PAGE:",
          page
        );

        const newVideos =
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

        doodVideos.push(
          ...newVideos
        );

      } catch (err) {

        console.log(
          "DOOD ERROR PAGE:",
          page,
          err
        );

      }

    }



    // =========================
    // FINAL VIDEO LIST
    // VIZEY PALING ATAS
    // =========================

    const videos = [

      ...vizeyVideos,

      ...doodVideos

    ];



    // =========================
    // REMOVE DUPLICATE
    // =========================

    const uniqueVideos =
      videos.filter(
        (video, index, self) =>
          index ===
          self.findIndex(
            v => v.url === video.url
          )
      );



    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json(
      uniqueVideos
    );

  } catch (err) {

    console.log(
      "SERVER ERROR:",
      err
    );

    return res.status(500).json({
      error:
        "Internal Server Error"
    });

  }
      }
