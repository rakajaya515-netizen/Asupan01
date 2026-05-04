async function loadVideos(reset = false) {
  if (loading) return;
  loading = true;

  try {
    const res = await fetch(`/api/videos?page=${page}&q=${query}`);
    const data = await res.json();

    console.log("VIDEOS:", data); // 🔥 DEBUG

    if (!data || data.length === 0) {
      console.log("DATA KOSONG");
      return;
    }

    if (reset) {
      container.innerHTML = "";
      page = 1;
    }

    data.forEach((video) => {
      const el = document.createElement("div");
      el.className = "card";

      el.innerHTML = `
        <a href="/watch?url=${encodeURIComponent(video.url)}">
          <img src="${video.thumbnail}" />
          <p>${video.title}</p>
        </a>
      `;

      container.appendChild(el);
    });

    page++;
  } catch (err) {
    console.error("ERROR:", err);
  }

  loading = false;
}
