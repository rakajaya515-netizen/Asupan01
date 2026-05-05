export default async function handler(req, res) {
  const API_KEY = process.env.VIZEY_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY missing" });
  }

  try {
    const response = await fetch(
      `https://vizey.co/api/v1/list?apikey=${API_KEY}&page=1`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const text = await response.text();

    // debug log
    console.log("RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON from Vizey" });
    }

    if (!data.success) {
      return res.status(500).json({ error: "Vizey API rejected" });
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json(data.data || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
}
