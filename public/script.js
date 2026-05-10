const grid = document.getElementById("videos");
const loading = document.getElementById("loading");
const search = document.getElementById("search");

let currentPage = 1;
let isLoading = false;
let hasMore = true;

let allVideos = [];

async function fetchVideos() {
  if (isLoading || !hasMore) return;

  isLoading = true;

  loading.innerHTML = "Loading videos...";

  try {
    const res = await fetch(`/api/videos?page=${currentPage}`);

    const data = await res.json();

    const videos = data.videos || [];

    if (videos.length === 0) {
      hasMore = false;
      loading.innerHTML = "No more videos";
      return;
    }

    allVideos.push(...videos);

    renderVideos(videos);

    currentPage++;

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

// infinite scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    fetchVideos();
  }
});

// search
search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  grid.innerHTML = "";

  const filtered = allVideos.filter((v) =>
    v.title.toLowerCase().includes(value)
  );

  renderVideos(filtered);
});

fetchVideos();
