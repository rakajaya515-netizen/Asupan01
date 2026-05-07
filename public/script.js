const container = document.getElementById("videos");

let allVideos = [];

async function getVideos() {

  try {

    const res = await fetch("/api/videos");

    const data = await res.json();

    allVideos = data;

    renderVideos(data);

  } catch (err) {

    console.log(err);

  }

}

function renderVideos(videos) {

  container.innerHTML = "";

  videos.forEach(video => {

    container.innerHTML += `
    
      <div class="card"
        onclick="window.open('${video.url}')">

        <img src="${video.thumbnail}" />

        <div class="overlay"></div>

        <h3>${video.title}</h3>

      </div>

    `;

  });

}


document
.getElementById("search")
.addEventListener("input", e => {

  const keyword =
    e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);

});


getVideos();
