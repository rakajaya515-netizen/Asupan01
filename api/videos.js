export default async function handler(req, res) {

  try {

    const DOOD_API =
      process.env.DOOD_API_KEY;

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    let doodVideos = [];

    let vizeyVideos = [];



    // ======================
    // DOODSTREAM
    // ======================

    try {

      for(let page = 1; page <= 3; page++){

        const response =
          await fetch(
            `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
          );

        const json =
          await response.json();

        const files =
          json.result?.files || [];

        const mapped =
          files.map(video => ({

            title:
              video.title ||
              "No Title",

            thumbnail:
              video.splash_img ||
              video.single_img ||
              "https://placehold.co/400x600?text=No+Image",

            url:
              video.download_url ||
              video.protected_embed ||
              "#",

            source:
              "doodstream"

          }));

        doodVideos.push(...mapped);

      }

    } catch(err){

      console.log(err);

    }



    // ======================
    // VIZEY
    // ======================

    try {

      for(let page = 1; page <= 3; page++){

        const response =
          await fetch(
            `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
          );

        const json =
          await response.json();

        const files =
          json.data || [];

        const mapped =
          files
            .filter(v => v.id)
            .map(video => ({

              title:
                video.title ||
                "No Title",

              thumbnail:
                video.thumbnail ||
                "https://placehold.co/400x600?text=No+Image",

              url:
                `https://vizey.net/watch/${video.id}`,

              source:
                "vizey"

            }));

        vizeyVideos.push(...mapped);

      }

    } catch(err){

      console.log(err);

    }



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
