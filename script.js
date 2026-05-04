let page = 1;
let loading = false;
let query = "";
let observer;

const container = document.getElementById("videos");

async function loadVideos(reset = false) {
  if (loading) return;
  loading = true;

  const res = await fetch(`/api/videos?page=${page}&q=${query}`);
  const data = await res.json();

  if (reset) {
    container.innerHTML = "";
    page = 1;
  }

  data.forEach((video) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <a href="/watch?url=${encodeURIComponent(video.url)}">
        <img loading="lazy" src="${video.thumbnail}" />
        <p>${video.title}</p>
      </a>
    `;

    container.appendChild(el);
  });

  page++;
  loading = false;
}

// 🔥 infinite scroll pakai observer (lebih ringan dari scroll event)
function initObserver() {
  const loader = document.getElementById("loader");

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadVideos();
    }
  });

  observer.observe(loader);
}

// 🔍 search debounce (biar ringan)
let debounce;
document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(debounce);

  debounce = setTimeout(() => {
    query = e.target.value;
    page = 1;
    loadVideos(true);
  }, 400);
});

// init
loadVideos();
initObserver();
