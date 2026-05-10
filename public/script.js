const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];
let filteredVideos = [];

let currentPage = 1;
const LIMIT = 40;

// =========================
// FETCH VIDEO
// =========================

async function fetchVideos() {

  try {

    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    if (!res.ok) {
      throw new Error("API ERROR");
    }

    const data = await res.json();

    // validasi array
    if (!Array.isArray(data)) {
      throw new Error("INVALID API");
    }

    // filter video valid
    allVideos = data.filter(v =>
      v &&
      v.title &&
      v.thumbnail &&
      v.url
    );

    filteredVideos = allVideos;

    currentPage = 1;

    renderVideos();

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML = "Failed load videos";

  }

}

// =========================
// RENDER VIDEO
// =========================

function renderVideos() {

  grid.innerHTML = "";

  const start = (currentPage - 1) * LIMIT;

  const end = start + LIMIT;

  const videos = filteredVideos.slice(start, end);

  if (videos.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        No videos found
      </div>
    `;

    return;

  }

  videos.forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">

        <img
          src="${video.thumbnail}"
          alt="${video.title}"
          loading="lazy"
        />

      </a>

      <div class="info">

        <h3>${video.title}</h3>

        <p>${video.source}</p>

      </div>
    `;

    grid.appendChild(card);

  });

  renderPagination();

}

// =========================
// PAGINATION
// =========================

function renderPagination() {

  let oldPagination =
    document.querySelector(".pagination");

  if (oldPagination) {
    oldPagination.remove();
  }

  const totalPages =
    Math.ceil(filteredVideos.length / LIMIT);

  const pagination =
    document.createElement("div");

  pagination.className = "pagination";

  // PREV

  const prevBtn =
    document.createElement("button");

  prevBtn.innerText = "Prev";

  prevBtn.disabled = currentPage === 1;

  prevBtn.onclick = () => {

    if (currentPage > 1) {

      currentPage--;

      renderVideos();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  };

  // PAGE INFO

  const pageInfo =
    document.createElement("span");

  pageInfo.innerText =
    `Page ${currentPage} / ${totalPages}`;

  // NEXT

  const nextBtn =
    document.createElement("button");

  nextBtn.innerText = "Next";

  nextBtn.disabled =
    currentPage >= totalPages;

  nextBtn.onclick = () => {

    if (currentPage < totalPages) {

      currentPage++;

      renderVideos();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  };

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);

  document.body.appendChild(pagination);

}

// =========================
// SEARCH
// =========================

search.addEventListener("input", e => {

  const value =
    e.target.value.toLowerCase();

  filteredVideos = allVideos.filter(video =>

    video.title
      .toLowerCase()
      .includes(value)

  );

  currentPage = 1;

  renderVideos();

});

// =========================
// INIT
// =========================

fetchVideos();
