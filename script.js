const API_KEY = 2b411a6b899373e60acb55c96a682f6506946723cdeaa537512c47c50a2dbac7;

// endpoint list video
const API_URL = `https://api.vidara.so/v1/video/list?api_key=${API_KEY}&limit=20`;

async function loadVideos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const container = document.getElementById("videoList");

    data.result.videos.forEach(video => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" />
        <div class="title">${video.title}</div>
      `;

      // klik → pindah ke halaman resmi
      card.onclick = () => {
        window.location.href = `https://vidara.so/${video.filecode}`;
      };

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
  }
}

loadVideos();
