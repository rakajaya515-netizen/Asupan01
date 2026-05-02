export const revalidate = 60; // cache 1 menit

export async function GET() {
  const DOOD = process.env.DOOD_API_KEY;
  const VIDARA = process.env.VIDARA_API_KEY;

  let results = [];

  try {
    // 🔥 DOOD
    if (DOOD) {
      const res = await fetch(
        `https://doodapi.co/api/file/list?key=${DOOD}`
      );
      const data = await res.json();

      if (data?.result?.files) {
        const dood = data.result.files.map(v => ({
          id: v.file_code,
          title: v.title,
          thumbnail: v.splash_img,
          source: "dood",
          created: v.uploaded || 0
        }));
        results.push(...dood);
      }
    }

    // 🔥 VIDARA
    if (VIDARA) {
      const res = await fetch(
        `https://api.vidara.so/v1/video/list?api_key=${VIDARA}`
      );
      const data = await res.json();

      if (data?.result?.videos) {
        const vidara = data.result.videos.map(v => ({
          id: v.filecode,
          title: v.title,
          thumbnail: v.thumbnail,
          source: "vidara",
          created: v.video_created || 0
        }));
        results.push(...vidara);
      }
    }

    // 🔥 SORT (terbaru)
    results.sort((a, b) => b.created - a.created);

    // 🔥 RANDOM
    results = results.sort(() => Math.random() - 0.5);

    return Response.json(results);
  } catch (err) {
    return Response.json({ error: "failed" });
  }
}
