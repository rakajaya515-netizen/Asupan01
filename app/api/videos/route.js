// app/api/videos/route.js

export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];
    let currentPage = 1;
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${currentPage}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!data.success) {
        break;
      }

      allVideos = [...allVideos, ...data.data];

      hasNext = data.pagination?.hasNext || false;

      currentPage++;
    }

    return Response.json(allVideos);
  } catch (err) {
    console.log(err);

    return Response.json([]);
  }
}
