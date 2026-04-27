<script>
async function loadVideos() {
  const res = await fetch("https://api.vidara.so/v1/file/list?api_key=881b10b3dab39e29f7926a376cba122b965b56d6f8a98b87d2f6ff709211998d");
  const data = await res.json();

  const container = document.getElementById("videos");
  container.innerHTML = "";

  data.result.files.forEach(v => {
    container.innerHTML += `
      <div class="card" onclick="play('${v.file_code}')">
        <img src="${v.thumbnail}">
        <div class="overlay">
          <p>${v.title || 'No Title'}</p>
        </div>
      </div>
    `;
  });
}

function play(code) {
  window.location.href = "player.html?code=" + code;
}

loadVideos();
</script>
