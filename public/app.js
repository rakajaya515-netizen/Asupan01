const container = document.getElementById("video-container");
const searchInput = document.getElementById("search");

// load awal
loadVideos();

async function loadVideos() {
  const res = await fetch("/api/videos");
  const data = await res.json();

  render(data);
}

function render(videos) {
  container.innerHTML = "";

  videos.forEach(v => {
    const thumb = v.thumbnail || v.player_img;
    const title = v.title || v.video_title;
    const link = v.url || v.link;

    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${thumb}">
      <div class="title">${title}</div>
    `;

    el.onclick = () => {
      window.location.href = link;
    };

    container.appendChild(el);
  });
}

// search
searchInput.addEventListener("input", async (e) => {
  const q = e.target.value;

  if (!q) return loadVideos();

  const res = await fetch(`/api/search?q=${q}`);
  const data = await res.json();

  render(data);
});
