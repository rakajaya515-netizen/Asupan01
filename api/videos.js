export default async function handler(req, res) {
  const API_KEY = 2b411a6b899373e60acb55c96a682f6506946723cdeaa537512c47c50a2dbac7;

  try {
    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil API" });
  }
}
