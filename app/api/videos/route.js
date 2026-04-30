export async function GET() {
  try {
    const DOOD_API_KEY = process.env.DOOD_API_KEY;
    const VIDARA_API_KEY = process.env.VIDARA_API_KEY;

    let doodVideos = [];
    let vidaraVideos = [];

    // ======================
    // DOODSTREAM
    // ======================
    try {
      const doodRes = await fetch(
        `https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`
      );
      const doodData = await doodRes.json();

      if (doodData?.result?.files) {
        doodVideos = doodData.result.files.map((v) => ({
          title: v.title,
          url: `https://dood.so/e/${v.file_code}`, // embed
          thumbnail: v.splash_img || "",
          source: "doodstream",
        }));
      }
    } catch (e) {
      console.log("Dood error:", e);
    }

    // ======================
    // VIDARA (FIXED)
    // ======================
    try {
      const vidaraRes = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA_API_KEY}&page=1&limit=50`
      );
      const vidaraData = await vidaraRes.json();

      if (vidaraData?.result?.videos) {
        vidaraVideos = vidaraData.result.videos.map((v) => ({
          title: v.title,
          url: v.link, // embed langsung
          thumbnail: v.thumbnail,
          source: "vidara",
        }));
      }
    } catch (e) {
      console.log("Vidara error:", e);
    }

    const allVideos = [...doodVideos, ...vidaraVideos];

    return Response.json(allVideos);
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
