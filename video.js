<script>
async function loadVideos() {
  const res = await fetch("/api/videos");
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
