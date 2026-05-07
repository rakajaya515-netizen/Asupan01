const container =
  document.getElementById("videos");

const loading =
  document.getElementById("loading");

const search =
  document.getElementById("search");

let allVideos = [];


// =========================
// FETCH VIDEOS
// =========================

async function loadVideos() {

  try {

    loading.style.display = "block";

    const res =
      await fetch("/api/videos");

    const data =
      await res.json();

    console.log(data);

    allVideos = data;

    renderVideos(data);

    loading.style.display = "none";

  } catch(err){

    console.log(err);

    loading.innerHTML =
      "Failed load videos";

  }

}


// =========================
// RENDER
// =========================

function renderVideos(videos){

  container.innerHTML = "";

  videos.forEach(video => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <img
        src="${video.thumbnail}"
        loading="lazy"
        alt="${video.title}"
      />

      <div class="overlay"></div>

      <h3>
        ${video.title}
      </h3>

    `;

    // CLICK

    card.addEventListener("click", () => {

      if(video.url && video.url !== "#"){

        window.location.href = video.url;

      }

    });

    container.appendChild(card);

  });

}


// =========================
// SEARCH
// =========================

search.addEventListener("input", e => {

  const keyword =
    e.target.value.toLowerCase();

  const filtered =
    allVideos.filter(video =>

      (video.title || "")
.toLowerCase()
      .includes(keyword)

    );

  renderVideos(filtered);

});


// =========================
// AUTO LOAD
// =========================

loadVideos();
