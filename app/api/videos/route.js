export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    const res = await fetch(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=1`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data.success) {
      return Response.json([]);
    }

    return Response.json(data.data);
  } catch (err) {
    return Response.json([]);
  }
}
