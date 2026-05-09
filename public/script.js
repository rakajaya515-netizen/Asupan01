const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];

// FETCH VIDEO
async function fetchVideos() {

  try {

    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    const data = await res.json();

    console.log(data);

    // AMBIL ARRAY VIDEOS
    allVideos = data.videos || [];

    // FILTER VIDEO VALID
    allVideos = allVideos.filter(
      video =>
        video &&
        video.url &&
        video.thumbnail
    );

    // RENDER
    renderVideos(allVideos);

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML = "Failed load videos";

  }

}

// RENDER VIDEO
function renderVideos(videos) {

  grid.innerHTML = "";

  videos.forEach(video => {

    const card =
      document.createElement("a");

    card.className = "card";

    card.href = video.url;

    card.target = "_blank";

    card.innerHTML = `
      <img src="${video.thumbnail}" />

      <div class="info">
        <h3>${video.title}</h3>
        <p>${video.source}</p>
      </div>
    `;

    grid.appendChild(card);

  });

}

// SEARCH
search.addEventListener("input", e => {

  const keyword =
    e.target.value.toLowerCase();

  const filtered =
    allVideos.filter(video =>
      video.title
        .toLowerCase()
        .includes(keyword)
    );

  renderVideos(filtered);

});

// START
fetchVideos();
