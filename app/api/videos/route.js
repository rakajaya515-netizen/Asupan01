let requestCount = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const window = 60 * 1000; // 1 menit

  if (!requestCount.has(ip)) {
    requestCount.set(ip, []);
  }

  const timestamps = requestCount.get(ip).filter(t => now - t < window);

  if (timestamps.length > 60) {
    return false;
  }

  timestamps.push(now);
  requestCount.set(ip, timestamps);
  return true;
}

export async function GET(req) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    "unknown";

  if (!rateLimit(ip)) {
    return new Response("Too many requests", { status: 429 });
  }

  try {
    // ===== VIDARA =====
    const vidaraRes = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.VIDARA_KEY}`
    );
    const vidaraJson = await vidaraRes.json();

    const vidaraVideos =
      vidaraJson.result?.videos?.map(v => ({
        title: v.title,
        thumbnail: v.thumbnail,
        video_url: v.link
      })) || [];

    // ===== DOOD =====
    const doodRes = await fetch(
      `https://doodapi.com/api/file/list?key=${process.env.DOOD_KEY}`
    );
    const doodJson = await doodRes.json();

    const doodVideos =
      doodJson.result?.files?.map(v => ({
        title: v.title,
        thumbnail: v.single_img,
        video_url: `https://dood.stream/d/${v.file_code}`
      })) || [];

    return Response.json([...vidaraVideos, ...doodVideos]);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
