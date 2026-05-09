const grid =
  document.getElementById("videos");

const loading =
  document.getElementById("loading");

const search =
  document.getElementById("search");

let allVideos = [];

let page = 1;

let loadingData = false;

let hasMore = true;

async function fetchVideos() {

  if (loadingData || !hasMore)
    return;

  loadingData = true;

  loading.innerHTML =
    "Loading videos...";

  try {

    const res =
      await fetch(
        `/api/videos?page=${page}`
      );

    const json =
      await res.json();

    console.log(json);

    const videos =
      json.videos || [];

    hasMore = json.hasMore;

    allVideos.push(...videos);

    renderVideos(videos);

    page++;

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML =
      "Failed load videos";

  }

  loadingData = false;

}

function renderVideos(videos){

  videos.forEach(video => {

    const card =
      document.createElement("a");

    card.className = "card";

    card.href = video.url;

    card.target = "_blank";

    card.innerHTML = `
      <img src="${video.thumbnail}">
      <div class="info">

        <div class="title">
          ${video.title}
        </div>

        <div class="source">
          ${video.source}
        </div>

      </div>
    `;

    grid.appendChild(card);

  });

}

window.addEventListener("scroll", () => {

  if (
    window.innerHeight +
    window.scrollY >=
    document.body.offsetHeight - 1000
  ) {

    fetchVideos();

  }

});

search.addEventListener("input", e => {

  const value =
    e.target.value.toLowerCase();

  grid.innerHTML = "";

  const filtered =
    allVideos.filter(v =>
      v.title
        .toLowerCase()
        .includes(value)
    );

  renderVideos(filtered);

});

fetchVideos();
