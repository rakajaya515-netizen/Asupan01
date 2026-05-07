export default async function handler(req, res) {

  try {

    const DOOD_API = process.env.DOOD_API_KEY;
    const VIZEY_API = process.env.VIZEY_API_KEY;

    // =========================
    // DOODSTREAM
    // =========================

    const doodRes = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API}`
    );

    const doodJson = await doodRes.json();

    const doodVideos =
      doodJson.result?.files?.map(video => ({

        title: video.title || "No Title",

        thumbnail:
          video.splash_img ||
          video.single_img ||
          "https://via.placeholder.com/300x400",

        url:
          video.download_url ||
          video.protected_embed,

        source: "doodstream"

      })) || [];


    // =========================
    // VIZEY
    // =========================

    const vizeyList =
  await fetch(
    `https://vizey.net/api/v1/list?apikey=${VIZEY_API}`
  );

const listJson =
  await vizeyList.json();

const vizeyVideos = [];

for (const item of listJson.data || []) {

  try {

    const detail =
      await fetch(
        `https://vizey.net/api/v1/videos?apikey=${VIZEY_API}&id=${item.id}`
      );

    const detailJson =
      await detail.json();

    const video =
      detailJson.data;

    vizeyVideos.push({

      title:
        video.title || "No Title",

      thumbnail:
        video.thumbnail,

      url:
        video.url ||
        video.embed ||
        "#",

      source:"vizey"

    });

  } catch(e) {}

}
      })) || [];


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

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
