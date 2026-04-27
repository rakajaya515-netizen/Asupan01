function openVideo(url) {
  window.location.href = "player.html?video=" + url;
}
export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.vidara.so/v1/video/list?api_key=" +
      process.env.API_KEY +
      "&page=1&limit=100"
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
