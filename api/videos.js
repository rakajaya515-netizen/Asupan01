module.exports = async (req, res) => {

  try {

    const DOOD_API =
      process.env.DOOD_API_KEY;

    const VIZEY_API =
      process.env.VIZEY_API_KEY;

    let videos = [];

    // =========================
    // DOODSTREAM
    // =========================

    try {

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
            video.title || "No title",

          thumbnail:
            video.splash_img ||
            video.single_img ||
            "https://placehold.co/400x600",

          url:
            video.download_url ||
            video.protected_embed ||
            "#",

          source:
            "dood"

        }));

      videos.push(...doodVideos);

    } catch (err) {

      console.log("DOOD ERROR", err);

    }

    // ====================
// VIZEY
// ====================

try {

  const vizeyRes =
    await fetchWithTimeout(
      `https://vizey.net/api/v1/list?apikey=${VIZEY_API}&page=1`
    );

  const vizeyJson =
    await vizeyRes.json();

  console.log("VIZEY:", vizeyJson);

  const vizeyVideos =
    (vizeyJson.data || [])
      .map(video => ({

        title:
          video.title || "No Title",

        thumbnail:
          video.thumbnail ||
          "https://placehold.co/400x600",

        // FIX LINK
        url:
          video.url ||
          `https://vizey.net/d/${video.id}`,

        source:
          "vizey"

      }));

  videos.push(...vizeyVideos);

} catch(err) {

  console.log("VIZEY ERROR:", err);

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
