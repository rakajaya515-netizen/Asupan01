const container =
  document.getElementById("videos");

const search =
  document.getElementById("search");

let allVideos = [];


async function loadVideos() {

  try {

    const res =
      await fetch("/api/videos");

    const data =
      await res.json();

    console.log(data);

    allVideos = data;

    renderVideos(data);

  } catch (err) {

    console.log(err);

  }

}


function renderVideos(videos) {

  container.innerHTML = "";

  videos.forEach(video => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `

      <img
        src="${video.thumbnail}"
        loading="lazy"
      />

      <div class="overlay"></div>

      <h3>${video.title}</h3>

    `;

    card.onclick = () => {

      window.open(video.url, "_blank");

    };

    container.appendChild(card);

  });

}


search.addEventListener("input", e => {

  const keyword =
    e.target.value.toLowerCase();

  const filtered =
    allVideos.filter(video =>

      video.title
      .toLowerCase()
      .includes(keyword)

    );

  renderVideos(filtered);

});


loadVideos();
