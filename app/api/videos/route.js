export async function GET() {
  const DOOD_API_KEY = process.env.NEXT_PUBLIC_DOOD_KEY;
  const VIDARA_API_KEY = process.env.NEXT_PUBLIC_VIDARA_KEY;

  let videos = [];

  // DOOD
  try {
    const res = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API_KEY}`
    );
    const data = await res.json();

    if (data?.result?.files) {
      const dood = data.result.files.map(v => ({
        title: v.title,
        thumbnail: v.splash_img,
        url: `/watch?source=dood&id=${v.file_code}`,
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
        url: `/watch?source=vidara&id=${v.filecode}`,
      }));

      videos.push(...vidara);
    }
  } catch (e) {
    console.log("VIDARA ERROR:", e);
  }

  return Response.json(videos);
}
