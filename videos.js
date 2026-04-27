export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.vidara.com/videos", {
      headers: {
        Authorization: "Bearer " + process.env.API_KEY
      }
    });

    const text = await response.text();

    res.status(200).send({
      status: response.status,
      data: text
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
