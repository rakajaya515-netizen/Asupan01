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
          url: `https://dood.so/e/${v.file_code}`,
          thumbnail: v.single_img || "",
          source: "doodstream",
        }));
      }
    } catch (e) {
      console.log("Dood error:", e);
    }

    // ======================
    // VIDARA (contoh generic)
    // ======================
    try {
      const vidaraRes = await fetch(
        `https://vidsrc.xyz/api/videos?key=${VIDARA_API_KEY}`
      );
      const vidaraData = await vidaraRes.json();

      if (Array.isArray(vidaraData)) {
        vidaraVideos = vidaraData.map((v) => ({
          title: v.title,
          url: v.video_url,
          thumbnail: v.thumbnail,
          source: "vidara",
        }));
      }
    } catch (e) {
      console.log("Vidara error:", e);
    }

    const allVideos = [...doodVideos, ...vidaraVideos];

    return Response.json(allVideos);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
