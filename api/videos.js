export default async function handler(req, res) {

  try {

    const API_KEY =
      process.env.VIZEY_API_KEY;

    const page =
      Number(req.query.page || 1);

    console.log("FETCH PAGE", page);

    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`
    );

    const data = await response.json();

    const videos =
      (data.data || []).map(v => ({

        id: v.id,

        title:
          v.title || "No title",

        thumbnail:
          v.thumbnail,

        url:
          `https://vizey.net/d/${v.id}`,

        source: "vizey"

      }));

    return res.status(200).json({
      videos
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      videos:[]
    });

  }

}
