const videosContainer = document.getElementById("videos");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

let allVideos = [];

// LOAD VIDEO
async function loadVideos() {
  try {
    loading.innerText = "Loading videos...";

    // API
    const res = await fetch("/api/videos");

    // DEBUG
    console.log("STATUS:", res.status);

    const data = await res.json();

    console.log("DATA API:", data);

    // AMBIL VIDEO
    allVideos = data.videos || [];

    // KALAU KOSONG
    if (!allVideos.length) {
      loading.innerText = "No videos found";
      return;
    }

    // TAMPILKAN
    renderVideos(allVideos);

    loading.style.display = "none";

  } catch (err) {
    console.error(err);

    loading.innerText = "Failed load videos";
  }
}

// RENDER VIDEO
function renderVideos(videos) {

  videosContainer.innerHTML = "";

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

    videosContainer.appendChild(card);

  });
}

// SEARCH
searchInput.addEventListener("input", (e) => {

  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter((video) =>
    video.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);

});

// START
loadVideos();
