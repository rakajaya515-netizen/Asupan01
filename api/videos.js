async function fetchWithTimeout(url, timeout = 8000) {

  const controller =
    new AbortController();

  const id =
    setTimeout(
      () => controller.abort(),
      timeout
    );

  const response =
    await fetch(url, {

      signal:
        controller.signal

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



    // ======================
    // DOODSTREAM
    // ======================

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
            video.title ||
            "No Title",

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

      videos.push(...doodVideos);

    } catch(err){

      console.log("DOOD ERROR");

    }



    // =====================
// VIZEY
// =====================

try {

  const vizeyRes =
    await fetchWithTimeout(VIZEY_API);

  const vizeyJson =
    await vizeyRes.json();

  const vizeyVideos =
    (Array.isArray(vizeyJson)
      ? vizeyJson
      : vizeyJson.result || []
    ).map(video => ({

      title:
        video.title ||
        "No Title",

      thumbnail:
        video.thumbnail ||
        video.image ||
        "https://placehold.co/400x600",

      url:
        video.url ||
        video.link ||
        "#",

      source:
        "vizey"

    }));

  videos.push(...vizeyVideos);

} catch(err) {

  console.log("VIZEY ERROR");

}


    // ======================
    // CACHE
    // ======================

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );



    return res
      .status(200)
      .json(videos);

  } catch(err){

    return res
      .status(500)
      .json({

        error:
          err.message

      });

  }

}
