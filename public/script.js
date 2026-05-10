const grid = document.getElementById("videos");
const loading = document.getElementById("loading");

let batch = 1;
let isLoading = false;
let finished = false;

const used = new Set();

async function loadVideos() {

  if (isLoading || finished) return;

  isLoading = true;

  loading.innerHTML = "Loading videos...";

  try {

    const res = await fetch(`/api/videos?batch=${batch}`);
    const data = await res.json();

    const videos = data.videos || [];

    if (videos.length === 0) {
      finished = true;
      loading.innerHTML = "No more videos";
      return;
    }

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

    batch++;

    loading.innerHTML = "";

  } catch (err) {

    loading.innerHTML = "Failed load videos";

  }

  isLoading = false;
}

// pertama kali
loadVideos();

// infinite scroll
window.addEventListener("scroll", () => {

  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 500) {
    loadVideos();
  }

});
