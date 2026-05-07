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

  let page = 1;

  let hasMore = true;

  while(hasMore){

    const doodRes =
      await fetch(
        `https://doodapi.co/api/file/list?key=${DOOD_API}&page=${page}`
      );

    const doodJson =
      await doodRes.json();

    const files =
      doodJson.result?.files || [];

    const mapped =
      files.map(video => ({

        title:
          video.title || "No Title",

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

    doodVideos.push(...mapped);

    if(files.length < 50){

      hasMore = false;

    } else {

      page++;

    }

  }

} catch(err){

  console.log(err);

}


    // =========================
    // VIZEY
    // =========================

try {

  let page = 1;

  let hasMore = true;

  while(hasMore){

    const vizeyRes =
      await fetch(
        `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
      );

    const vizeyJson =
      await vizeyRes.json();

    const videos =
      vizeyJson.data || [];

    const mapped =
      videos.map(video => ({

        title:
          video.title || "No Title",

        thumbnail:
          video.thumbnail ||
          "https://via.placeholder.com/300x400",

        url:
          video.id
          ? `https://vizey.net/embed/${video.id}`
          : "#",

        source:"vizey"

      }));

    vizeyVideos.push(...mapped);

    if(videos.length < 50){

      hasMore = false;

    } else {

      page++;

    }

  }

} catch(err){

  console.log(err);

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
