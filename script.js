let allVideos = [];

async function loadVideos() {
  try {
    const [vidaraRes, vizeyRes] = await Promise.all([
      fetch("/api/vidara"),
      fetch("/api/vizey")
    ]);

    const vidara = await vidaraRes.json();
    const vizey = await vizeyRes.json();

    // 🔥 NORMALISASI
    const vidaraMapped = vidara.map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      url: v.link
    }));

    const vizeyMapped = vizey.map(v => ({
      title: v.title,
      thumbnail: v.thumbnail,
      url: `https://vizey.co/watch/${v.id}`
    }));

    allVideos = [...vidaraMapped, ...vizeyMapped];

    renderVideos(allVideos);

  } catch (err) {
    console.error(err);
  }
}

function renderVideos(videos) {
  const container = document.getElementById("video-grid");

  if (!videos.length) {
    container.innerHTML = "<p>No more video</p>";
    return;
  }

  container.innerHTML = videos.map(video => `
    <div class="card" onclick="window.open('${video.url}', '_blank')">
      <img src="${video.thumbnail}" loading="lazy" />
      <p>${video.title}</p>
    </div>
  `).join("");
}

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

// 🚀 LOAD
loadVideos();
