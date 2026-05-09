const videosContainer =
  document.getElementById("videos");

const loading =
  document.getElementById("loading");

const searchInput =
  document.getElementById("search");

let allVideos = [];

// ======================
// LOAD VIDEOS
// ======================

async function loadVideos() {

  try {

    loading.innerHTML =
      "Loading videos...";

    const response =
      await fetch("/api/videos");

    const data =
      await response.json();

    console.log(data);

    // FIX IMPORTANT
    allVideos = data.videos || [];

    renderVideos(allVideos);

  } catch (err) {

    console.log(err);

    loading.innerHTML =
      "Failed load videos";
  }
}

// ======================
// RENDER
// ======================

function renderVideos(videos) {

  videosContainer.innerHTML = "";

  if (!videos.length) {

    loading.innerHTML =
      "No videos";

    return;
  }

  loading.style.display = "none";

  videos.forEach((video) => {

    const card =
      document.createElement("a");

    card.className = "card";

    card.href = video.url;

    card.target = "_blank";

    card.innerHTML = `
      <img
        src="${video.thumbnail}"
        alt="${video.title}"
      />

      <div class="info">

        <div class="title">
          ${video.title}
        </div>

        <div class="source">
          ${video.source}
        </div>

      </div>
    `;

    videosContainer.appendChild(card);
  });
}

// ======================
// SEARCH
// ======================

searchInput.addEventListener(
  "input",
  (e) => {

    const keyword =
      e.target.value.toLowerCase();

    const filtered =
      allVideos.filter((video) =>
        video.title
          .toLowerCase()
          .includes(keyword)
      );

    renderVideos(filtered);
  }
);

// ======================
// START
// ======================

loadVideos();
