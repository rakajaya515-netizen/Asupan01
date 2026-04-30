export async function GET() {
  try {
    // ====================
    // VIDARA
    // ====================
    const vidaraRes = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_KEY}`
    );
    const vidaraJson = await vidaraRes.json();

    const vidaraVideos =
      vidaraJson?.result?.videos?.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        video_url: v.link
      })) || [];

    // ====================
    // DOODSTREAM
    // ====================
    const doodRes = await fetch(
      `https://doodapi.co/api/file/list?key=${process.env.DOOD_KEY}`
    );
    const doodJson = await doodRes.json();

    const doodVideos =
      doodJson?.result?.files?.map(v => ({
        title: v.title,
        thumbnail: v.single_img,
        video_url: `https://dood.stream/e/${v.file_code}`
      })) || [];

    // ====================
    // GABUNG
    // ====================
    const allVideos = [...vidaraVideos, ...doodVideos];

    return Response.json(allVideos);
  } catch (err) {
    return Response.json({ error: "failed fetch" }, { status: 500 });
  }
}
