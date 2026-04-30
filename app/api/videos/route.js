export async function GET() {
  try {
    const API_KEY = process.env.DOOD_API_KEY;

    const res = await fetch(
      `https://doodapi.com/api/file/list?key=${API_KEY}`
    );

    const data = await res.json();

    const videos = data?.result?.files?.map((v) => ({
      title: v.title || "No Title",
      thumbnail: `https://img.doodcdn.com/snaps/${v.file_code}.jpg`,
      video_url: `https://doodstream.com/e/${v.file_code}`
    })) || [];

    return Response.json(videos);
  } catch (err) {
    return Response.json([]);
  }
}
