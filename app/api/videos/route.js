export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;

  if (!DOOD_API_KEY) {
    return Response.json({ error: "API KEY kosong" });
  }

  try {
    const res = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API_KEY}`
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({ error: "Bukan JSON", raw: text });
    }

    if (!data?.result?.files) {
      return Response.json([]);
    }

    const videos = data.result.files.map(v => ({
      title: v.title,
      thumbnail: v.splash_img,
      id: v.file_code
    }));

    return Response.json(videos);

  } catch (e) {
    return Response.json({ error: "Server error" });
  }
}
