  const grid = document.getElementById("videos");
const loading = document.getElementById("loading");

let currentPage = 1;

let isLoading = false;

let finished = false;

const used = new Set();

async function loadVideos() {

  if (isLoading || finished) return;

  isLoading = true;

  loading.innerHTML = "Loading videos...";

  try {

    console.log("LOAD PAGE:", currentPage);

    const res = await fetch(
      `/api/videos?page=${currentPage}`
    );

    const data = await res.json();

    console.log(data);

    const videos = data.videos || [];

    // kalau kosong = selesai
    if (videos.length === 0) {

      finished = true;

      loading.innerHTML = "All videos loaded";

      return;
    }

    videos.forEach(video => {

      if (!video.thumbnail) return;

      if (used.has(video.url)) return;

      used.add(video.url);

      const card = document.createElement("a");

      card.href = video.url;

      card.target = "_blank";

      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" />

        <div class="info">
          <h3>${video.title}</h3>
          <span>${video.source}</span>
        </div>
      `;

      grid.appendChild(card);

    });

    // lanjut ke page berikutnya
    currentPage++;

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML = "Failed load videos";

  }

  isLoading = false;
}

// load awal
loadVideos();


// auto load next page saat scroll bawah
window.addEventListener("scroll", () => {

  if (isLoading || finished) return;

  const scrollY = window.scrollY;

  const screenHeight = window.innerHeight;

  const fullHeight = document.body.offsetHeight;

  // kalau hampir bawah
  if (scrollY + screenHeight >= fullHeight - 1000) {

    loadVideos();

  }

});
