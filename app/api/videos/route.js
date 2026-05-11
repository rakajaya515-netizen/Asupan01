export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    let currentPage = 1;
    let hasNext = true;

    let allVideos = [];

    while (hasNext) {
      const response = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${currentPage}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!data.success) {
        break;
      }

      const videos = data.data || [];

      // hapus video duplicate
      const uniqueVideos = videos.filter(
        (video, index, self) =>
          index ===
          self.findIndex((v) => v.id === video.id)
      );

      allVideos.push(...uniqueVideos);

      // pagination
      hasNext = data.pagination?.hasNext || false;

      currentPage++;

      // delay anti rate limit
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    }

    // hapus duplicate global
    const finalVideos = allVideos.filter(
      (video, index, self) =>
        index ===
        self.findIndex((v) => v.id === video.id)
    );

    return Response.json(finalVideos);
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
