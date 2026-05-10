export default async function handler(req, res) {

  const page = req.query.page || 1;

  const VIZEY_API = process.env.VIZEY_API_KEY;
  const DOOD_API = process.env.DOOD_API_KEY;

  try {

    let videos = [];

    // VIZEY
    const vizeyRes = await fetch(
      `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=${page}`
    );

    const vizeyData = await vizeyRes.json();

    const vizeyVideos = (vizeyData.data || []).map(v => ({
      title: v.title || "No Title",
      thumbnail: v.thumbnail,
      url: v.url,
      source: "vizey"
    }));

    videos.push(...vizeyVideos);

    // DOOD
    const doodRes = await fetch(
      `https://doodapi.com/api/file/list?key=${DOOD_API}&page=${page}`
    );

    const doodData = await doodRes.json();

    const doodVideos = (doodData.result?.files || []).map(v => ({
      title: v.title || "No Title",
      thumbnail: v.splash_img,
      url: `https://dood.so/e/${v.file_code}`,
      source: "dood"
    }));

    videos.push(...doodVideos);

    // hapus duplikat
    const unique = [];

    const seen = new Set();

    for (const v of videos) {

      if (!seen.has(v.url)) {

        seen.add(v.url);

        unique.push(v);

      }

    }

    res.status(200).json(unique);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed load videos"
    });

  }

}
