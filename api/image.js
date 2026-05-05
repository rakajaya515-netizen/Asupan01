export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("No URL");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://google.com"
      }
    });

    if (!response.ok) {
      return res.status(500).send("Failed fetch image");
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Proxy error");
  }
}
