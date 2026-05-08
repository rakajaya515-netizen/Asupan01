async function fetchWithTimeout(url, timeout = 10000) {

  const controller = new AbortController();

  const id = setTimeout(
    () => controller.abort(),
    timeout
  );

  const response = await fetch(url, {
    signal: controller.signal
  });

  clearTimeout(id);

  return response;
}

export default async function handler(req, res) {

  try {

    const DOOD_API =
      process.env.DOOD_API_KEY;

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    let videos = [];

    // ====================
    // DOODSTREAM
    // ====================

    try {

      const doodRes =
        await fetchWithTimeout(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=1`
        );

      const doodJson =
        await doodRes.json();

      const doodVideos =
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
              "dood"

          }));

      videos.push(...doodVideos);

    } catch (err) {

      console.log("DOOD ERROR:", err);

    }

    // ====================
    // VIZEY
    // ====================

    try {

      const vizeyRes =
        await fetchWithTimeout(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=1`
        );

      const vizeyJson =
        await vizeyRes.json();

      console.log(vizeyJson);

      const vizeyVideos =
        (vizeyJson.data || [])
          .map(video => ({

            title:
              video.title || "No Title",

            thumbnail:
              video.thumbnail ||
              "https://placehold.co/400x600",

            url:
              video.url ||
              `https://vizey.net/d/${video.id}`,

            source:
              "vizey"

          }));

      videos.push(...vizeyVideos);

    } catch (err) {

      console.log("VIZEY ERROR:", err);

    }

    return res.status(200).json(videos);

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });

  }

}

