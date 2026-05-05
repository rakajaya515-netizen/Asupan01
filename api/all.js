export default async function handler(req, res) {
  try {
    const [vidaraRes, vizeyRes] = await Promise.all([
      fetch(`${req.headers.origin}/api/vidara`),
      fetch(`${req.headers.origin}/api/vizey`)
    ]);

    let vidara = [];
    let vizey = [];

    try {
      const v1 = await vidaraRes.json();
      vidara = Array.isArray(v1) ? v1 : (v1.data || []);
    } catch {}

    try {
      const v2 = await vizeyRes.json();
      vizey = Array.isArray(v2) ? v2 : (v2.data || []);
    } catch {}

    const combined = [...vidara, ...vizey];

    res.status(200).json(combined);

  } catch (e) {
    res.status(200).json([]); // ❗ jangan error, biar frontend gak crash
  }
}
