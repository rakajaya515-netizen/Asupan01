const grid = document.getElementById("videos");
const search = document.getElementById("search");
const loading = document.getElementById("loading");

let allVideos = [];

async function fetchVideos() {

  try {

    loading.innerHTML = "Loading videos...";

    const res = await fetch("/api/videos");

    const data = await res.json();

    allVideos = data;

    renderVideos(allVideos);

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML = "Failed load videos";

  }

}

function renderVideos(videos) {

  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">
        <img src="${video.thumbnail}">
      </a>

      <div class="info">
        <h3>${video.title}</h3>
        <p>${video.source}</p>
      </div>
    `;

    grid.appendChild(card);

  });

}

search.addEventListener("input", e => {

  const value = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(value)
  );

  renderVideos(filtered);

});

fetchVideos();
