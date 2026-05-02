export async function GET() {
  const DOOD_API_KEY = process.env.DOOD_API_KEY;

  console.log("API KEY:", DOOD_API_KEY);

  try {
    const res = await fetch(
      `https://doodapi.co/api/file/list?key=${DOOD_API_KEY}`
    );

    const text = await res.text(); // 🔥 jangan langsung json

    console.log("RAW:", text);

    const data = JSON.parse(text);

    if (!data?.result?.files) {
      return Response.json({ error: "No files", data });
    }

    const videos = data.result.files.map(v => ({
      title: v.title,
      thumbnail: v.splash_img,
      id: v.file_code
    }));

    return Response.json(videos);

  } catch (e) {
    console.log("ERROR:", e);
    return Response.json({ error: "Server error" });
  }
}
