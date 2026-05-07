export default async function handler(req, res) {

  try {

    const DOOD_API =
      process.env.DOOD_API_KEY;

    const VIZEY_API =
      process.env.VIZEY_API_KEY;



    // ======================
    // DOODSTREAM
    // ======================

    const doodRes =
      await fetch(
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
          "doodstream"

      }));



    // ======================
    // VIZEY
    // ======================

    const vizeyRes =
      await fetch(
        `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=1`
      );

    const vizeyJson =
      await vizeyRes.json();

    const vizeyVideos =
      (vizeyJson.data || [])
      .filter(v => v.id)
      .map(video => ({

        title:
          video.title || "No Title",

        thumbnail:
          video.thumbnail ||
          "https://placehold.co/400x600",

        url:
          `https://vizey.net/watch/${video.id}`,

        source:
          "vizey"

      }));



    // ======================
    // MERGE
    // ======================

    const videos = [

      ...doodVideos,

      ...vizeyVideos

    ];



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

        error: err.message

      });

  }

}
