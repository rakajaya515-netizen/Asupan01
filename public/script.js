let allVideos = [];

async function loadVideos() {
  try {
    const [vidaraRes, vizeyRes] = await Promise.all([
      fetch("/api/vidara"),
      fetch("/api/vizey")
    ]);

    const vidara = await vidaraRes.json();
    const vizey = await vizeyRes.json();

    console.log("VIDARA:", vidara);
    console.log("VIZEY:", vizey);

    // 🔥 mapping fleksibel (biar gak error walau field beda)
    const mapData = (arr) =>
      arr.map(v => ({
        title: v.title || v.name || "No title",
        thumbnail: v.thumbnail || v.thumb || "https://via.placeholder.com/300x200",
        url: v.link || v.url || v.video_url || "#"
      }));

    allVideos = [...mapData(vidara), ...mapData(vizey)];

    renderVideos(allVideos);

  } catch (err) {
    console.error(err);
    document.getElementById("video-grid").innerHTML =
      "<p>Gagal load video 😢</p>";
  }
}

function renderVideos(videos) {
  const container = document.getElementById("video-grid");

  if (!videos.length) {
    container.innerHTML = "<p>Tidak ada video</p>";
    return;
  }

  container.innerHTML = videos.map(video => `
    <div class="card" onclick="window.open('${video.url}', '_blank')">
      <img src="${video.thumbnail}" loading="lazy"/>
      <p>${video.title}</p>
    </div>
  `).join("");
}

// 🔍 search
document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

loadVideos();
