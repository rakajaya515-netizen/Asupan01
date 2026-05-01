export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;
  const VIDARA_API_KEY = process.env.VIDARA_API_KEY;

  let videos = [];

  // DOOD
  try {
    const res = await fetch(`https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`);
    const data = await res.json();

    if (data?.result?.files) {
      videos.push(
        ...data.result.files.map(v => ({
          title: v.title,
          thumbnail: v.single_img,
          link: `/watch?source=dood&id=${v.file_code}`
        }))
      );
    }
  } catch (e) {}

  // VIDARA
  try {
    const res = await fetch(`https://api.vidara.so/v1/video/list?api_key=${VIDARA_API_KEY}`);
    const data = await res.json();

    if (data?.result?.videos) {
      videos.push(
        ...data.result.videos.map(v => ({
          title: v.title,
          thumbnail: v.thumbnail,
          link: `/watch?source=vidara&id=${v.filecode}`
        }))
      );
    }
  } catch (e) {}

  return Response.json(videos);
}
