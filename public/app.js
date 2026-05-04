function render(videos) {
  container.innerHTML = "";

  videos.forEach(v => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${v.thumbnail || 'https://via.placeholder.com/300'}">
      <div class="title">${v.title || 'No title'}</div>
    `;

    el.onclick = () => {
      if (v.url) {
        window.open(v.url, "_blank");
      }
    };

    container.appendChild(el);
  });
}
