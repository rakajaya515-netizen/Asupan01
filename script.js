let page = 1;
let loading = false;
let query = "";

const container = document.getElementById("videos");
const searchInput = document.getElementById("search");

async function loadVideos(reset = false) {
  if (loading) return;
  loading = true;

  try {
    const res = await fetch("/api/videos");
    const data = await res.json();

    console.log("VIDEOS:", data);

    if (!data || data.length === 0) {
      container.innerHTML = "<p>Tidak ada video</p>";
      return;
    }

    if (reset) {
      container.innerHTML = "";
      page = 1;
    }

    data.forEach((video) => {
      const el = document.createElement("div");
      el.className = "card";

      el.innerHTML = `
        <a href="/watch?url=${encodeURIComponent(video.url)}">
          <img src="${video.thumbnail}" />
          <p>${video.title}</p>
        </a>
      `;

      container.appendChild(el);
    });

  } catch (err) {
    console.error("ERROR:", err);
    container.innerHTML = "<p>Error load video</p>";
  }

  loading = false;
}

// search
searchInput.addEventListener("input", (e) => {
  query = e.target.value;
  loadVideos(true);
});

// first load
loadVideos();
