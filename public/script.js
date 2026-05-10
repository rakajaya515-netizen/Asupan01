const grid = document.getElementById("videos");

const loading = document.getElementById("loading");

let currentPage = 1;

let loadingNow = false;

let finished = false;

const used = new Set();

async function loadVideos() {

  if (loadingNow || finished) return;

  loadingNow = true;

  loading.innerHTML = "Loading videos...";

  try {

    const res = await fetch(
      `/api/videos?page=${currentPage}`
    );

    const data = await res.json();

    const videos = data.videos || [];

    console.log("PAGE:", currentPage);

    console.log(videos.length);

    // kalau kosong stop
    if (videos.length === 0) {

      finished = true;

      loading.innerHTML =
        "All videos loaded";

      return;
    }

    let added = 0;

    videos.forEach(video => {

      if (!video.thumbnail) return;

      if (used.has(video.url)) return;

      used.add(video.url);

      added++;

      const card =
        document.createElement("a");

      card.href = video.url;

      card.target = "_blank";

      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" alt="">

        <div class="info">
          <h3>${video.title}</h3>
          <span>${video.source}</span>
        </div>
      `;

      grid.appendChild(card);

    });

    // kalau page duplicate semua
    if (added === 0) {

      finished = true;

      loading.innerHTML =
        "No more videos";

      return;
    }

    currentPage++;

    loading.innerHTML = "";

  } catch (err) {

    console.log(err);

    loading.innerHTML =
      "Failed load videos";

  }

  loadingNow = false;
}


// load awal
loadVideos();


// auto next page
window.addEventListener("scroll", () => {

  if (loadingNow || finished) return;

  const scrollBottom =
    window.innerHeight +
    window.scrollY;

  const fullHeight =
    document.body.offsetHeight;

  if (scrollBottom >= fullHeight - 800) {

    loadVideos();

  }

});
