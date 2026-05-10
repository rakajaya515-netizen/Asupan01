const videosEl = document.getElementById("videos");
const loadingEl = document.getElementById("loading");
const pageEl = document.getElementById("page");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const searchInput = document.getElementById("search");

let currentPage = 1;
let allVideos = [];

async function loadVideos(page = 1){

  loadingEl.innerText = "Loading videos...";

  try{

    const res = await fetch(`/api/videos?page=${page}`);

    const data = await res.json();

    allVideos = data;

    renderVideos(allVideos);

    pageEl.innerText = page;

    loadingEl.innerText = "";

  }catch(err){

    console.log(err);

    loadingEl.innerText = "Failed load videos";

  }
}

function renderVideos(videos){

  videosEl.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">
        <img src="${video.thumbnail}" />
      </a>

      <h3>${video.title}</h3>

      <p>${video.source}</p>
    `;

    videosEl.appendChild(card);

  });

}

nextBtn.onclick = () => {

  currentPage++;

  loadVideos(currentPage);

};

prevBtn.onclick = () => {

  if(currentPage > 1){

    currentPage--;

    loadVideos(currentPage);

  }

};

searchInput.addEventListener("input", e => {

  const q = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(q)
  );

  renderVideos(filtered);

});

loadVideos(currentPage);
