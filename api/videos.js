export default async function handler(req, res) {

  const VIZEY_KEY =
    process.env.VIZEY_API_KEY;

  const DOOD_KEY =
    process.env.DOOD_API_KEY;

  const page =
    Number(req.query.page || 1);

  try {

    let allVideos = [];

    // =========================
    // VIZEY
    // =========================

    try {

      const vizeyRes =
        await fetch(
          `https://vizey.net/api/v1/list?apikey=${VIZEY_KEY}&page=${page}`
        );

      const vizeyJson =
        await vizeyRes.json();

      const vizeyVideos =
        (vizeyJson.data || []).map(v => ({

          title:
            v.title || "No Title",

          thumbnail:
            v.thumbnail ||
            v.preview ||
            "",

          url:
            `https://vizey.net/d/${v.id}`,

          source:"vizey"

        }));

      allVideos.push(...vizeyVideos);

    } catch (e) {
      console.log("VIZEY ERROR");
    }

    // =========================
    // DOOD
    // =========================

    try {

      const doodRes =
        await fetch(
          `https://doodapi.com/api/file/list?key=${DOOD_KEY}&page=${page}`
        );

      const doodJson =
        await doodRes.json();

      const doodVideos =
        (doodJson.result?.files || []).map(v => ({

          title:
            v.title || "No Title",

          thumbnail:
            v.splash_img ||
            v.single_img ||
            "",

          url:
            `https://dood.so/e/${v.file_code}`,

          source:"dood"

        }));

      allVideos.push(...doodVideos);

    } catch (e) {
      console.log("DOOD ERROR");
    }

    // =========================
    // REMOVE DUPLICATE
    // =========================

    const unique =
      Array.from(
        new Map(
          allVideos.map(v =>
            [v.url, v]
          )
        ).values()
      );

    // cache
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=600"
    );

    res.status(200).json({

      success:true,

      page,

      videos:unique,

      hasMore:
        unique.length > 0

    });

  } catch (err) {

    res.status(500).json({

      success:false,

      error:"Failed fetch videos"

    });

  }

}
