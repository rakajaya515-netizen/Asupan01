export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;

  try {
    const res = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API_KEY}`
    );

    const data = await res.json();

    if (!data?.result?.files) {
      return Response.json([]);
    }

    const videos = data.result.files.map((v) => ({
      title: v.title,
      thumbnail: v.single_img, // fix thumbnail
      url: `/watch?id=${v.file_code}`, // arah ke player
    }));

    return Response.json(videos);
  } catch (e) {
    console.log("ERROR:", e);
    return Response.json([]);
  }
}
