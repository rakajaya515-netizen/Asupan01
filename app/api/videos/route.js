export async function GET() {
  const DOOD_API_KEY = process.env.NEXT_PUBLIC_DOOD_KEY;

  try {
    const res = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API_KEY}`
    );

    const data = await res.json();

    if (!data?.result?.files) {
      return Response.json([]);
    }

    const videos = data.result.files.map(v => ({
      title: v.title,
      thumbnail: v.splash_img,
      id: v.file_code // 🔥 WAJIB ADA
    }));

    return Response.json(videos);

  } catch (e) {
    console.log("ERROR:", e);
    return Response.json([]);
  }
}
