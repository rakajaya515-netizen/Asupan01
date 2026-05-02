export async function GET() {
  const DOOD = process.env.DOOD_API_KEY;
  const VIDARA = process.env.VIDARA_API_KEY;

  let results = [];

  try {
    // 🔥 DOOD
    if (DOOD) {
      const res = await fetch(`https://doodapi.co/api/file/list?key=${DOOD}`);
      const data = await res.json();

      if (data?.result?.files) {
        const doodVideos = data.result.files.map(v => ({
          id: v.file_code,
          title: v.title,
          thumbnail: v.splash_img,
          source: "dood"
        }));

        results.push(...doodVideos);
      }
    }

    // 🔥 VIDARA
    if (VIDARA) {
      const res = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA}`);
      const data = await res.json();

      if (data?.result?.videos) {
        const vidaraVideos = data.result.videos.map(v => ({
          id: v.filecode,
          title: v.title,
          thumbnail: v.thumbnail,
          source: "vidara"
        }));

        results.push(...vidaraVideos);
      }
    }

    // 🔥 RANDOM + SORT
    results = results
      .sort(() => Math.random() - 0.5)
      .slice(0, 50);

    return Response.json(results);
  } catch (err) {
    console.log(err);
    return Response.json([]);
  }
}
