export default async function handler(req, res) {
  const API_KEY = 2b411a6b899373e60acb55c96a682f6506946723cdeaa537512c47c50a2dbac7;

  if (!API_KEY) {
    return res.status(500).json({ error: "API KEY kosong" });
  }

  try {
    const url = `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({
        error: "Fetch gagal",
        status: response.status
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
