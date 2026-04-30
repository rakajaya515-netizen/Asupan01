export async function GET() {
  try {
    const vidaraKey = process.env.VIDARA_API_KEY;
    const doodKey = process.env.DOOD_API_KEY;

    // 🔴 FETCH VIDARA
    const vidaraRes = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${vidaraKey}&limit=20`
    );
    const vidaraData = await vidaraRes.json();

    const vidaraVideos =
      vidaraData?.result?.videos?.map((v) => ({
        title: v.title,
        thumbnail: v.thumbnail,
        video_url: `https://vidara.so/embed-${v.filecode}.html`,
        source: "vidara",
      })) || [];

    // 🔵 FETCH DOODSTREAM
    const doodRes = await fetch(
      `https://doodapi.co/api/file/list?key=${doodKey}`
    );
    const doodData = await doodRes.json();

    const doodVideos =
      doodData?.result?.files?.map((v) => ({
        title: v.title,
        thumbnail: v.splash_img || v.single_img,
        video_url: `https://dood.stream/e/${v.file_code}`,
        source: "dood",
      })) || [];

    // 🔀 GABUNG
    const allVideos = [...vidaraVideos, ...doodVideos];

    return Response.json(allVideos);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal load semua video" });
  }
}
