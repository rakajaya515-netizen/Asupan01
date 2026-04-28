async function loadVideos() {
  try {
    const res = await fetch("/api/videos");
    const data = await res.json();

    const container = document.getElementById("videos");
    container.innerHTML = "";

    data.result.videos.forEach(v => {
      container.innerHTML += `
        <div class="card" onclick="play('${v.filecode}')">
          <img src="${v.thumbnail}">
          <div class="overlay">
            <p>${v.title || 'No Title'}</p>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.log("Error:", err);
  }
}
