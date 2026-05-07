export default async function handler(req, res) {

  try {

    const DOOD_API =
      process.env.DOOD_API_KEY;

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    let doodVideos = [];
    let vizeyVideos = [];


    // =========================
    // DOODSTREAM
    // =========================

    try {

      const doodRes =
        await fetch(
          `https://doodapi.co/api/file/list?key=${DOOD_API}`
        );

      const doodJson =
        await doodRes.json();

      if (
        doodJson.result &&
        doodJson.result.files
      ) {

        doodVideos =
          doodJson.result.files.map(video => ({

            title:
              video.title ||
              "No Title",

            thumbnail:
              video.splash_img ||
              video.single_img ||
              "https://via.placeholder.com/300x400",

            url:
              video.download_url ||
              video.protected_embed ||
              "#",

            source:"doodstream"

          }));

      }

    } catch(err){

      console.log("DOOD ERROR:", err);

    }


    // =========================
    // VIZEY
    // =========================

    try {

      const vizeyRes =
        await fetch(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_API}`
        );

      const vizeyJson =
        await vizeyRes.json();

      if (
        vizeyJson.data &&
        Array.isArray(vizeyJson.data)
      ) {

        vizeyVideos =
          vizeyJson.data.map(video => ({

            title:
              video.title ||
              "No Title",

            thumbnail:
              video.thumbnail ||
              "https://via.placeholder.com/300x400",

            url:
              video.id
              ? `https://vizey.net/view/${video.id}`
              : "#",

            source:"vizey"

          }));

      }

    } catch(err){

      console.log("VIZEY ERROR:", err);

    }


    // =========================
    // MERGE
    // =========================

    const videos = [

      ...doodVideos,

      ...vizeyVideos

    ];


    // =========================
    // CACHE
    // =========================

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );


    return res.status(200).json(videos);

  } catch(err){

    return res.status(500).json({

      error: err.message

    });

  }

}
