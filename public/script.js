const grid = document.getElementById("videos");
const loading = document.getElementById("loading");
const search = document.getElementById("search");

let currentPage = 1;

let isLoading = false;
let hasMore = true;

let allVideos = [];

// GLOBAL DUPLICATE FILTER
const renderedUrls = new Set();

async function fetchVideos() {
  if (isLoading || !hasMore) return;

  isLoading = true;

  loading.innerHTML = "Loading videos...";

  try {
    const res = await fetch(`/api/videos?page=${currentPage}`);

    const data = await res.json();

    const videos = data.videos || [];

    // jika kosong stop
    if (videos.length === 0) {
      hasMore = false;

      loading.innerHTML = "No more videos";

      return;
    }

    // FILTER DUPLICATE GLOBAL
    const uniqueVideos = videos.filter((video) => {
      if (renderedUrls.has(video.url)) {
        return false;
      }

      renderedUrls.add(video.url);

      return true;
    });

    // jika semua duplicate
    if (uniqueVideos.length === 0) {
      currentPage++;

      isLoading = false;

      fetchVideos();

      return;
    }

    allVideos.push(...uniqueVideos);

    renderVideos(uniqueVideos);

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

// SEARCH
search.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  grid.innerHTML = "";

  const filtered = allVideos.filter((video) =>
    video.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

// INFINITE SCROLL
window.addEventListener("scroll", () => {
  const scrollPosition =
    window.innerHeight + window.scrollY;

  const bottom =
    document.body.offsetHeight - 1200;

  if (scrollPosition >= bottom) {
    fetchVideos();
  }
});

// START
fetchVideos();
