let allVideos = [];

async function loadVideos() {
  const container = document.getElementById("videoList");
  const loading = document.getElementById("loading");

  try {
    const res = await fetch("/api/videos");
    const json = await res.json();

    allVideos = json || [];

    if (allVideos.length === 0) {
      loading.innerText = "Tidak ada video";
      return;
    }

    renderVideos(allVideos);
    loading.style.display = "none";

  } catch (err) {
    loading.innerText = "Gagal load data";
    console.error(err);
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList");
  container.innerHTML = "";

  videos.forEach(v => {
    let url = "#";

    if (v.source === "vidara") {
      url = `https://vidara.so/v/${v.filecode}`;
    } else {
      url = `https://vizey.co/v/${v.filecode}`;
    }

    container.innerHTML += `
      <div class="card" onclick="window.open('${url}', '_blank')">
        <img src="${v.thumbnail}" loading="lazy">
        <div class="title">${v.title}</div>
      </div>
    `;
  });
}

loadVideos();
