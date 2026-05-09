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

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    const DOOD_API =
      process.env.DOOD_API_KEY;

    let allVideos = [];

    // =========================
    // VIZEY FIRST
    // =========================

    for (let page = 1; page <= 100; page++) {

      try {

        console.log("VIZEY PAGE:", page);

        const response =
          await fetchWithTimeout(
            `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
          );

        const json =
          await response.json();

        const videos =
          (json.data || [])
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

        // MASUKKAN VIDEO
        allVideos.push(...videos);

        // STOP JIKA HABIS
        if (!videos.length) {
          break;
        }

      } catch (err) {

        console.log(
          "VIZEY ERROR PAGE:",
          page
        );

      }

    }

    // =========================
    // DOOD BELOW
    // =========================

    for (let page = 1; page <= 50; page++) {

      try {

        console.log("DOOD PAGE:", page);

        const response =
          await fetchWithTimeout(
            `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
          );

        const json =
          await response.json();

        const videos =
          (json.result?.files || [])
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

        // MASUKKAN VIDEO
        allVideos.push(...videos);

        // STOP JIKA HABIS
        if (!videos.length) {
          break;
        }

      } catch (err) {

        console.log(
          "DOOD ERROR PAGE:",
          page
        );

      }

    }

    // =========================
    // HAPUS DUPLIKAT
    // =========================

    const uniqueVideos =
      Array.from(
        new Map(
          allVideos.map(v => [v.url, v])
        ).values()
      );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

      success: true,

      total:
        uniqueVideos.length,

      videos:
        uniqueVideos

    });

  } catch (err) {

    console.log(err);

    return res.status(200).json({
  success: true,
  total: allVideos.length,
  videos: allVideos
});

  }

}
