export async function GET() {
  try {
    // =============================
    // 🔥 FETCH DOODSTREAM
    // =============================
    const doodRes = await fetch(
      `https://doodapi.com/api/file/list?key=${process.env.DOOD_API_KEY}`
    );
    const doodData = await doodRes.json();

    let doodVideos = [];

    if (doodData?.result?.files) {
      doodVideos = doodData.result.files.map((v) => ({
        title: v.title || "No Title",
        thumbnail: `https://img.doodcdn.com/snaps/${v.file_code}.jpg`,
        video_url: `https://doodstream.com/e/${v.file_code}`,
        source: "dood",
      }));
    }

    // =============================
    // 🔥 FETCH VIDARA
    // (sesuaikan endpoint kalau beda)
    // =============================
    const vidaraRes = await fetch(
      `https://vidara.io/api/videos?key=${process.env.VIDARA_API_KEY}`
    );
    const vidaraData = await vidaraRes.json();

    let vidaraVideos = [];

    if (vidaraData?.data) {
      vidaraVideos = vidaraData.data.map((v) => ({
        title: v.title || "No Title",
        thumbnail: v.thumbnail,
        video_url: v.video_url,
        source: "vidara",
      }));
    }

    // =============================
    // 🔥 GABUNG + RANDOM
    // =============================
    const allVideos = [...doodVideos, ...vidaraVideos];

    // shuffle biar acak
    const shuffled = allVideos.sort(() => 0.5 - Math.random());

    return Response.json(shuffled);
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json([]);
  }
}
