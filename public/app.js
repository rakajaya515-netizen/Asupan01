const container = document.getElementById("video-container");
const searchInput = document.getElementById("search");

loadVideos();

async function loadVideos() {
  const res = await fetch("/api/videos");
  const data = await res.json();

  render(data);
}

function render(videos) {
  container.innerHTML = "";

  videos.forEach(v => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${v.thumbnail}">
      <div class="title">${v.title}</div>
    `;

    // 🔥 FIX: buka halaman asli
    el.onclick = () => {
      window.open(v.url, "_blank");
    };

    container.appendChild(el);
  });
}

/* SEARCH */
searchInput.addEventListener("input", async (e) => {
  const q = e.target.value;

  if (!q) return loadVideos();

  const res = await fetch(`/api/search?q=${q}`);
  const data = await res.json();

  render(data);
});
