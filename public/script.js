const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];
let filteredVideos = [];

let currentIndex = 0;
const LOAD_COUNT = 50;

let loadingMore = false;

// FETCH API
async function fetchVideos() {
  try {
    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    if (!res.ok) {
      throw new Error("API ERROR");
    }

    const json = await res.json();

    console.log(json);

    // SUPPORT FORMAT ARRAY / OBJECT
    const videos = Array.isArray(json)
      ? json
      : json.videos || [];

    // FILTER VIDEO VALID
    allVideos = videos.filter(
      (v) =>
        v &&
        v.title &&
        v.thumbnail &&
        v.url
    );

    filteredVideos = [...allVideos];

    grid.innerHTML = "";
    currentIndex = 0;

    renderMore();

    loading.innerHTML = "";
  } catch (err) {
    console.log(err);

    loading.innerHTML = "Failed load videos";
  }
}

// RENDER VIDEO
function renderMore() {
  if (loadingMore) return;

  loadingMore = true;

  const nextVideos = filteredVideos.slice(
    currentIndex,
    currentIndex + LOAD_COUNT
  );

  nextVideos.forEach((video) => {
    const card = document.createElement("a");

    card.className = "card";

    card.href = video.url;
    card.target = "_blank";

    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" />

      <div class="info">
        <h3>${video.title}</h3>
        <p>${video.source}</p>
      </div>
    `;

    grid.appendChild(card);
  });

  currentIndex += LOAD_COUNT;

  loadingMore = false;
}

// SEARCH
search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  filteredVideos = allVideos.filter((v) =>
    v.title.toLowerCase().includes(value)
  );

  grid.innerHTML = "";
  currentIndex = 0;

  renderMore();
});

// INFINITE SCROLL
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    renderMore();
  }
});

// START
fetchVideos();
