// public/script.js

const grid =
  document.getElementById("videoGrid");

const searchInput =
  document.getElementById("search");

const loading =
  document.getElementById("loading");

let allVideos = [];

let filteredVideos = [];

let currentPage = 1;

const LIMIT = 20;

let isLoading = false;



// ======================
// FETCH VIDEOS
// ======================

async function fetchVideos() {

  try {

    loading.innerHTML =
      "Loading videos...";

    const res =
      await fetch("/api/videos");

    const data =
      await res.json();

    allVideos =
      data.filter(v => v.url);

    filteredVideos =
      allVideos;

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



// ======================
// RENDER VIDEOS
// ======================

function renderVideos() {

  if (isLoading) return;

  isLoading = true;

  const start =
    (currentPage - 1) * LIMIT;

  const end =
    start + LIMIT;

  const videos =
    filteredVideos.slice(start, end);

  videos.forEach(video => {

    const card =
      document.createElement("a");

    card.className =
      "card";

    card.href =
      video.url;

    card.target =
      "_blank";

    card.innerHTML = `

      <div class="thumb-wrap">

        <img
          src="${video.thumbnail}"
          alt="${video.title}"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x600?text=No+Image'"
        />

      </div>

      <div class="info">

        <h3>${video.title || "")
.toLowerCase()}</h3>

        <span>${video.source}</span>

      </div>

    `;

    grid.appendChild(card);

  });

  isLoading = false;

}



// ======================
// SEARCH
// ======================

searchInput.addEventListener(
  "input",
  e => {

    const value =
      e.target.value.toLowerCase();

    filteredVideos =
      allVideos.filter(video =>
        (video.title || "")
          .toLowerCase()
          .includes(value)
      );

    grid.innerHTML = "";

    currentPage = 1;

    renderVideos();

  }
);



// ======================
// INFINITE SCROLL
// ======================

window.addEventListener(
  "scroll",
  () => {

    const {

      scrollTop,

      scrollHeight,

      clientHeight

    } = document.documentElement;

    if (

      scrollTop + clientHeight >=
      scrollHeight - 300

    ) {

      const maxPage =
        Math.ceil(
          filteredVideos.length / LIMIT
        );

      if (currentPage < maxPage) {

        currentPage++;

        renderVideos();

      }

    }

  }
);



// ======================
// INIT
// ======================

fetchVideos();
