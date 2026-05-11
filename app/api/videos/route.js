export async function GET() {
  try {
    const API_KEY = process.env.VIZEY_API_KEY;

    let allVideos = [];
    let seenIds = new Set();

    // ambil maksimal 20 halaman
    for (let page = 1; page <= 20; page++) {
      const res = await fetch(
        `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`,
        {
          cache: "no-store",
        }
      );

      const json = await res.json();

      // stop kalau gagal
      if (!json.success) {
        break;
      }

      // stop kalau data kosong
      if (!json.data || json.data.length === 0) {
        break;
      }

      // filter duplicate
      const uniqueVideos = json.data.filter((video) => {
        if (seenIds.has(video.id)) {
          return false;
        }

        seenIds.add(video.id);
        return true;
      });

      // stop kalau page isinya duplicate semua
      if (uniqueVideos.length === 0) {
        break;
      }

      allVideos.push(...uniqueVideos);

      // delay kecil biar tidak kena rate limit
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    }

    return Response.json(allVideos);
  } catch (err) {
    console.log(err);

    return Response.json([]);
  }
}
