let allVideos = []

async function loadVideos() {
  const res = await fetch('/api/videos')
  const json = await res.json()

  const videos = json.result?.videos || []
  allVideos = videos

  renderVideos(videos)
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  videos.forEach(v => {
    const div = document.createElement("div")
    div.className = "video"

    let finalLink = "#"

    // 🔥 LOGIC PENTING
    if (v.source === "vidara") {
      finalLink = `https://vidara.so/v/${v.filecode}`
    } else if (v.source === "dood") {
      finalLink = `https://doodstream.com/d/${v.filecode}`
    }

    div.innerHTML = `
      <img src="${v.thumbnail}">
      <p>${v.title}</p>
    `

    div.onclick = () => {
      window.location.href = finalLink
    }

    container.appendChild(div)
  })
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const key = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v =>
    (v.title || "").toLowerCase().includes(key)
  )

  renderVideos(filtered)
})

loadVideos()
