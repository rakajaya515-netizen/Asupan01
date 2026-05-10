async function fetchJson(url, timeout = 15000) {

  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const res = await fetch(url, {
    signal: controller.signal
  });

  clearTimeout(id);

  return res.json();

}

export default async function handler(req, res) {

  try {

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    const DOOD_API =
      process.env.DOOD_API_KEY;

    let videos = [];

    const used = new Set();

    // =========================
    // VIZEY
    // =========================

    const vizeyPromises = [];

    for (let page = 1; page <= 100; page++) {

      vizeyPromises.push(

        fetchJson(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
        ).catch(() => null)

      );

    }

    const vizeyResults =
      await Promise.all(vizeyPromises);

    vizeyResults.forEach(data => {

      if (!data) return;

      const pageVideos =
        (data.data || []).map(v => ({

          id: `v-${v.id}`,

          title:
            v.title || "No title",

          thumbnail:
            v.thumbnail,

          url:
            `https://vizey.net/d/${v.id}`,

          source: "vizey"

        }));

      pageVideos.forEach(video => {

        if (!video.url) return;

        if (used.has(video.url)) return;

        used.add(video.url);

        videos.push(video);

      });

    });

    // =========================
    // DOOD
    // =========================

    const doodPromises = [];

    for (let page = 1; page <= 50; page++) {

      doodPromises.push(

        fetchJson(
          `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
        ).catch(() => null)

      );

    }

    const doodResults =
      await Promise.all(doodPromises);

    doodResults.forEach(data => {

      if (!data) return;

      const pageVideos =
        (data.result?.files || []).map(v => ({

          id: `d-${v.file_code}`,

          title:
            v.title || "No title",

          thumbnail:
            v.splash_img,

          url:
            `https://dood.so/e/${v.file_code}`,

          source: "dood"

        }));

      pageVideos.forEach(video => {

        if (!video.url) return;

        if (used.has(video.url)) return;

        used.add(video.url);

        videos.push(video);

      });

    });

    // =========================
    // RESPONSE
    // =========================

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    res.status(200).json(videos);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed load videos"
    });

  }

}
