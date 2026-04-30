export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;
  const VIDARA_API_KEY = process.env.VIDARA_API_KEY;

  let videos = [];

  // DOODSTREAM
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

      videos = [...videos, ...dood];
    }
  } catch (e) {
    console.log("Dood error:", e);
  }

  // VIDARA
  try {
    const res = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${VIDARA_API_KEY}&limit=20`
    );
    const data = await res.json();

    if (data?.result?.videos) {
      const vidara = data.result.videos.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        url: `/watch?source=vidara&id=${v.filecode}`
      }));

      videos = [...videos, ...vidara];
    }
  } catch (e) {
    console.log("Vidara error:", e);
  }

  return Response.json(videos);
}
