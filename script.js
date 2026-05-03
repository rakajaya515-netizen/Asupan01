let allVideos = []

async function loadVideos() {
  try {
    const res = await fetch('/api/videos')
    const json = await res.json()

    const videos = json.result?.videos || []

    console.log("VIDEOS:", videos)

    allVideos = videos
    renderVideos(videos)

  } catch (err) {
    document.getElementById("videoList").innerHTML = "Error load data"
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  if (!videos.length) {
    container.innerHTML = "Tidak ada video"
    return
  }

  videos.forEach(v => {
    const div = document.createElement("div")
    div.className = "video"

    let finalLink = "#"

    // 🔥 PENTING
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

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const key = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v =>
    (v.title || "").toLowerCase().includes(key)
  )

  renderVideos(filtered)
})

loadVideos()
