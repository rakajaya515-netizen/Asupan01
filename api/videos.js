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

    const page =
      Number(req.query.page || 1);

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    const DOOD_API =
      process.env.DOOD_API_KEY;

    let vizeyVideos = [];
    let doodVideos = [];



    // =====================
    // VIZEY
    // =====================

    try {

      const vizeyRes =
        await fetchWithTimeout(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        );

      const vizeyJson =
        await vizeyRes.json();

      vizeyVideos =
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

    } catch (err) {

      console.log(
        "VIZEY ERROR:",
        err
      );

    }



    // =====================
    // DOODSTREAM
    // =====================

    try {

      const doodRes =
        await fetchWithTimeout(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
        );

      const doodJson =
        await doodRes.json();

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



    // =====================
    // FINAL
    // =====================

    const videos = [

      ...vizeyVideos,

      ...doodVideos

    ];



    return res.status(200).json(
      videos
    );

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: "Server Error"
    });

  }

}
