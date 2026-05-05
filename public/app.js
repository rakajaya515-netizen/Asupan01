const API_URL = "/api/videos";

let allVideos = [];

async function fetchVideos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

    allVideos = data.videos || [];
    renderVideos(allVideos);

  } catch (err) {
    console.error("ERROR:", err);
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList");

  container.innerHTML = videos.map(video => `
    <a href="${video.url}" target="_blank" class="card">
      <img src="${video.thumbnail}" 
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'" />
      <div class="title">${video.title || 'No Title'}</div>
    </a>
  `).join("");
}

/* SEARCH */
document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    (v.title || "").toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

fetchVideos();
