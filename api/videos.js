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



    // ==// ======================
// VIZEY
// ======================

try {

  if (VIZEY_API) {

    const endpoints = [

      `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=1`,

      `https://vizey.net/api/v1/files?key=${VIZEY_API}`,

      

    ];

    for (const endpoint of endpoints) {

      try {

        const res =
          await fetchWithTimeout(endpoint);

        const json =
          await res.json();

        console.log("VIZEY RESPONSE:", json);

        const files =
          json.result ||
          json.files ||
          json.data ||
          [];

        if (Array.isArray(files)) {

          const parsed =
            files.map((video) => ({

              title:
                video.title ||
                "No title",

              thumbnail:
                video.splash_img ||
                video.single_img ||
                video.thumbnail ||
                "https://placehold.co/400x600",

              url:
                video.download_url ||
                video.protected_embed ||
                video.url ||
                "#",

              source:
                "vizey"

            }));

          videos.push(...parsed);

          break;
        }

      } catch (e) {

        console.log("ENDPOINT FAILED");

      }

    }

  }

} catch (err) {

  console.log("VIZEY ERROR:", err);

}

    // ======================
    // CACHE
    // ======================

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );

console.log(videos);

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
