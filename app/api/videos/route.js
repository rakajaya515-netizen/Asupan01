export async function GET() {
  const DOOD = process.env.DOOD_API_KEY;
  const VIDARA = process.env.VIDARA_API_KEY;

  let results = [];

  try {
    // 🔥 DOODSTREAM
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

    // 🔥 VIDARA (contoh endpoint, sesuaikan jika beda)
    if (VIDARA) {
      const res = await fetch(`https://vidara.api/list?key=${VIDARA}`);
      const data = await res.json();

      if (data?.result) {
        const vidaraVideos = data.result.map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          source: "vidara"
        }));

        results.push(...vidaraVideos);
      }
    }

    return Response.json(results);
  } catch (err) {
    console.log("ERROR:", err);
    return Response.json([]);
  }
}
