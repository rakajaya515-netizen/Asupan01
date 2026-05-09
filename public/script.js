const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];
let filteredVideos = [];

let currentIndex = 0;
const LOAD_COUNT = 30;

let rendering = false;

// FETCH VIDEOS
async function fetchVideos() {
  try {
    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    if (!res.ok) {
      throw new Error("API ERROR");
    }

    const json = await res.json();

    console.log(json);

    // SUPPORT ARRAY / OBJECT
    let videos = [];

    if (Array.isArray(json)) {
      videos = json;
    } else if (json.videos) {
      videos = json.videos;
    }

    // FILTER VALID
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

    renderVideos();

    loading.innerHTML = "";
  } catch (err) {
    console.log(err);

    loading.innerHTML = "Failed load videos";
  }
}

// RENDER
function renderVideos() {
  if (rendering) return;

  rendering = true;

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
      <img 
        src="${video.thumbnail}" 
        alt="${video.title}"
        loading="lazy"
      />

      <div class="info">
        <h3>${video.title}</h3>
        <p>${video.source}</p>
      </div>
    `;

    grid.appendChild(card);
  });

  currentIndex += LOAD_COUNT;

  rendering = false;
}

// SEARCH
search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  filteredVideos = allVideos.filter((v) =>
    v.title.toLowerCase().includes(value)
  );

  grid.innerHTML = "";
  currentIndex = 0;

  renderVideos();
});

// INFINITE SCROLL
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1200
  ) {
    renderVideos();
  }
});

// START
fetchVideos();
