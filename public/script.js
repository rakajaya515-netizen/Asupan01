const res = await fetch("/api/videos");
const data = await res.json();

allVideos = data;
filteredVideos = data;

renderVideos();
