const grid = document.getElementById("videos");
const loading = document.getElementById("loading");

let currentPage = 1;

let loadingNow = false;
let hasNext = true;

const used = new Set();

async function loadVideos() {

  if (loadingNow || !hasNext) return;

  loadingNow = true;

  loading.innerHTML = "Loading videos...";

  try {

    const res = await fetch(`/api/videos?page=${currentPage}`);
    const data = await res.json();

    const videos = data.videos || [];

    videos.forEach(video => {

      if (used.has(video.url)) return;

      used.add(video.url);

      const card = document.createElement("a");

      card.href = video.url;
      card.target = "_blank";

      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" />

        <div class="info">
          <h3>${video.title}</h3>
          <span>${video.source}</span>
        </div>
      `;

      grid.appendChild(card);

    });

    hasNext = data.hasNext;

    currentPage++;

    if (!hasNext) {
      loading.innerHTML = "All videos loaded";
    } else {
      loading.innerHTML = "";
    }

  } catch (err) {

    loading.innerHTML = "Failed load videos";

  }

  loadingNow = false;
}

loadVideos();

window.addEventListener("scroll", () => {

  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight - 500
  ) {
    loadVideos();
  }

});
