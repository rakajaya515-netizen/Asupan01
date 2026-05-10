async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("API ERROR");
  }

  return res.json();
}

export default async function handler(req, res) {
  try {
    const API = process.env.VIZEY_API_KEY;

    let videos = [];
    let used = new Set();

    let page = 1;
    let hasNext = true;

    // ambil semua page vizey
    while (hasNext) {
      try {

        const data = await fetchJson(
          `https://vizey.net/api/v1/list?apikey=${API}&page=${page}`
        );

        const items = data?.data || [];

        items.forEach(v => {

          const url = `https://vizey.net/d/${v.id}`;

          if (used.has(url)) return;

          used.add(url);

          videos.push({
            id: v.id,
            title: v.title || "No title",
            thumbnail: v.thumbnail,
            url,
            source: "vizey"
          });

        });

        // pagination asli dari api
        hasNext = data?.pagination?.hasNext || false;

        page++;

        // safety limit
        if (page > 500) {
          hasNext = false;
        }

      } catch (err) {

        console.log("PAGE ERROR", page);

        hasNext = false;
      }
    }

    // urut terbaru
    videos.reverse();

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    );

    return res.status(200).json({
      total: videos.length,
      videos
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: true
    });
  }
}
