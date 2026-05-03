let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch("/api/videos")
    const json = await res.json()

    // ambil videos dari result
    allVideos = json.result.videos || []

    renderVideos(allVideos)

  } catch (err) {
    container.innerHTML = "Error load: " + err.message
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")

  if (!videos.length) {
    container.innerHTML = "Tidak ada video"
    return
  }

  container.innerHTML = ""

  videos.forEach(v => {
    const div = document.createElement("div")
    div.className = "video"

    div.innerHTML = `
      <img src="${v.thumbnail}">
      <p>${v.title}</p>
    `

    // 🔥 klik buka halaman asli via iframe
  
      div.onclick = () => {
  let url

  if (v.filecode) {
    url = `https://vidara.so/v/${v.filecode}`
  } else {
    url = v.link
  }

  window.open(url, "_blank")
      }

    container.appendChild(div)
  })
}

function openVideo(url) {
  document.getElementById("modal").style.display = "block"
  document.getElementById("player").src = url
}

function closeVideo() {
  document.getElementById("modal").style.display = "none"
  document.getElementById("player").src = ""
}

// SEARCH
document.getElementById("search").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  )

  renderVideos(filtered)
})

// load pertama
loadVideos()
