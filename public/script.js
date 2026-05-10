const grid = document.getElementById("videos");
const search = document.getElementById("search");

let allVideos = [];

async function fetchVideos() {
  try {
    const res = await fetch("/api/videos");

    const data = await res.json();

    allVideos = data;

    renderVideos(allVideos);
  } catch (err) {
    grid.innerHTML =
      "<h2 style='color:white'>Failed load videos</h2>";
  }
}

function renderVideos(videos) {
  grid.innerHTML = "";

  videos.forEach((video) => {
    grid.innerHTML += `
      <a href="${video.url}" target="_blank" class="card">
        <img src="${video.thumbnail}" alt="${video.title}">
        
        <div class="info">
          <h3>${video.title}</h3>
          <p>${video.source}</p>
        </div>
      </a>
    `;
  });
}

search.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter((v) =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

fetchVideos();
