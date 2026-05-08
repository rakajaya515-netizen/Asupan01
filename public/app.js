const grid =
  document.getElementById("videos");

const loading =
  document.getElementById("loading");

const search =
  document.getElementById("search");

let currentPage = 1;

let loadingVideos = false;

let allVideos = [];



// ======================
// FETCH VIDEOS
// ======================

async function fetchVideos() {

  if (loadingVideos) return;

  loadingVideos = true;

  loading.innerHTML =
    "Loading videos...";

  try {

    const res =
      await fetch(
        `/api/videos?page=${currentPage}`
      );

    const data =
      await res.json();

    allVideos.push(...data);

    renderVideos(data);

    currentPage++;

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML =
      "Failed load videos";

  }

  loadingVideos = false;

}



// ======================
// RENDER
// ======================

function renderVideos(videos) {

  videos.forEach(video => {

    const a =
      document.createElement("a");

    a.className = "card";

    a.href = video.url;

    a.target = "_blank";

    a.innerHTML = `
      <img src="${video.thumbnail}" alt="">
      <div class="overlay"></div>
      <h3>${video.title}</h3>
    `;

    grid.appendChild(a);

  });

}



// ======================
// INFINITE SCROLL
// ======================

window.addEventListener(
  "scroll",
  () => {

    if (
      window.innerHeight +
      window.scrollY >=
      document.body.offsetHeight - 1000
    ) {

      fetchVideos();

    }

  }
);



// ======================
// SEARCH
// ======================

search.addEventListener(
  "input",
  e => {

    const value =
      e.target.value.toLowerCase();

    grid.innerHTML = "";

    const filtered =
      allVideos.filter(video =>
        video.title
          .toLowerCase()
          .includes(value)
      );

    renderVideos(filtered);

  }
);



// FIRST LOAD
fetchVideos();
