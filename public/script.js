const grid = document.getElementById("videos");
const loading = document.getElementById("loading");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNum = document.getElementById("pageNum");

let currentPage = 1;

async function fetchVideos(page = 1) {
  loading.innerHTML = "Loading videos...";

  grid.innerHTML = "";

  try {
    const res = await fetch(`/api/videos?page=${page}`);

    const data = await res.json();

    const videos = data.videos || [];

    if (videos.length === 0) {
      loading.innerHTML = "No videos";

      return;
    }

    renderVideos(videos);

    pageNum.innerHTML = page;

    loading.innerHTML = "";
  } catch (err) {
    loading.innerHTML = "Failed load videos";
  }
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

// NEXT
nextBtn.addEventListener("click", () => {
  currentPage++;

  fetchVideos(currentPage);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// PREV
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;

  currentPage--;

  fetchVideos(currentPage);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

fetchVideos(currentPage);
