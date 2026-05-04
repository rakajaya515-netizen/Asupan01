const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

let allVideos = [];

async function loadVideos() {
  const res = await fetch("/api/videos");
  const data = await res.json();

  allVideos = data;
  render(data);
}

function render(videos) {
  grid.innerHTML = "";

  videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${v.thumbnail}" />
      <div class="title">${v.title}</div>
    `;

    card.onclick = () => {
      window.location.href = v.url; // ✅ redirect ke API asli
    };

    grid.appendChild(card);
  });
}

// SEARCH
searchInput.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  render(filtered);
});

loadVideos();
