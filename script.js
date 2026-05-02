const API_URL = "/api/videos";

async function loadVideos() {
  const container = document.getElementById("videoList");

  container.innerHTML = "<p style='padding:10px'>Loading...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

    // 🔥 FIX DI SINI
    const videos = data.result?.videos;

    if (!videos || videos.length === 0) {
      container.innerHTML = "<p style='padding:10px'>Data kosong</p>";
      return;
    }

    container.innerHTML = "";

    videos.forEach(video => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" />
        <div class="title">${video.title || "No Title"}</div>
      `;

      card.onclick = () => {
        window.location.href = video.link; // 🔥 pakai link langsung dari API
      };

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='padding:10px'>Error load</p>";
  }
}

loadVideos();
