export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.vidara.so/v1/video/list?api_key=${process.env.API_KEY}&limit=20`
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed fetch" });
  }
}

    // sesuaikan dengan struktur API asli
    const list = data.result || data.data || [];

    const videos = list.map(item => ({
      title: item.title || item.caption,
      thumbnail: item.thumbnail || item.thumb,
      url: item.url || item.link
    }));

    res.status(200).json({ videos });

  } catch (err) {
    res.status(500).json({ error: "API error", detail: err.message });
  }
}
