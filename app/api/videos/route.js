export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];

    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        return Response.json({
          success: false,
          error: data.message,
        });
      }

      allVideos.push(...data.data);

      if (!data.pagination?.hasNext) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return Response.json(allVideos);
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
