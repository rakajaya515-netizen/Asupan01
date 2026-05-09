const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];
let filteredVideos = [];

// FETCH VIDEOS
async function fetchVideos() {
  try {
    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    if (!res.ok) {
      throw new Error("API ERROR");
    }

    const data = await res.json();

    console.log(data);

    // pastikan array
    if (!Array.isArray(data)) {
      throw new Error("Invalid API response");
    }

    // filter video valid
    allVideos = data.filter(
      (v) =>
        v &&
        v.url &&
        v.thumbnail
    );

    filteredVideos = allVideos;

    grid.innerHTML = "";
    currentPage = 1;

    renderVideos();

    loading.innerHTML = "";
  } catch (err) {
    console.log(err);

    loading.innerHTML =
      "Failed load videos";
  }
}

// RENDER
function renderVideos() {
  if (isLoading) return;

  isLoading = true;

  const start = (currentPage - 1) * LIMIT;
  const end = start + LIMIT;

  const videos =
    filteredVideos.slice(start, end);

  videos.forEach((video) => {
    const a = document.createElement("a");

    a.className = "card";
    a.href = video.url;
    a.target = "_blank";

    a.innerHTML = `
      <img src="${video.thumbnail}" alt="">
      <div class="overlay"></div>
      <h3>${video.title || "No title"}</h3>
    `;

    grid.appendChild(a);
  });

  isLoading = false;
}

// INFINITE SCROLL
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 500
  ) {
    if (
      currentPage * LIMIT <
      filteredVideos.length
    ) {
      currentPage++;
      renderVideos();
    }
  }
});

// SEARCH
search.addEventListener("input", (e) => {
  const value =
    e.target.value.toLowerCase();

  filteredVideos = allVideos.filter(
    (video) =>
      video.title
        .toLowerCase()
        .includes(value)
  );

  grid.innerHTML = "";
  currentPage = 1;

  renderVideos();
});

// START
fetchVideos();
