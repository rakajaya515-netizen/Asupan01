const grid = document.getElementById("videos");
const loading = document.getElementById("loading");

let currentBatch = 1;

let isLoading = false;

let hasMore = true;

const renderedUrls = new Set();

async function fetchVideos() {
  if (isLoading || !hasMore) return;

  isLoading = true;

  loading.innerHTML = "Loading videos...";

  try {
    const res = await fetch(
      `/api/videos?batch=${currentBatch}`
    );

    const data = await res.json();

    const videos = data.videos || [];

    if (videos.length === 0) {
      hasMore = false;

      loading.innerHTML = "No more videos";

      return;
    }

    const uniqueVideos = videos.filter((video) => {
      if (renderedUrls.has(video.url)) {
        return false;
      }

      renderedUrls.add(video.url);

      return true;
    });

    renderVideos(uniqueVideos);

    currentBatch++;

    loading.innerHTML = "";
  } catch (err) {
    loading.innerHTML = "Failed load videos";
  }

  isLoading = false;
}

function renderVideos(videos) {
  videos.forEach((video) => {
    const card = document.createElement("a");

    card.className = "card";

    card.href = video.url;

    card.target = "_blank";

    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}">

      <div class="info">
        <h3>${video.title}</h3>
        <p>${video.source}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    fetchVideos();
  }
});

fetchVideos();
