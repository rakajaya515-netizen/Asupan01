export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;
  const VIDARA_API_KEY = process.env.VIDARA_API_KEY;

  let videos = [];

  // DOOD
  try {
    const res = await fetch(
      `https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`
    );
    const data = await res.json();

    if (data?.result?.files) {
      const dood = data.result.files.map(v => ({
        title: v.title,
        thumbnail: v.single_img,
        url: `/watch?source=dood&id=${v.file_code}`
      }));

      videos.push(...dood);
    }
  } catch (e) {
    console.log("DOOD ERROR:", e);
  }

  // VIDARA
  try {
    const res = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${VIDARA_API_KEY}`
    );
    const data = await res.json();

    if (data?.result?.videos) {
      const vidara = data.result.videos.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        url: `/watch?source=vidara&id=${v.filecode}`
      }));

      videos.push(...vidara);
    }
  } catch (e) {
    console.log("VIDARA ERROR:", e);
  }

  return Response.json(videos);
}
