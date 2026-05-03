let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")
  container.innerHTML = "Loading..."

  try {
    const res = await fetch("/api/videos", {
      cache: "no-store"
    })

    const json = await res.json()
    const videos = json.result?.videos || []

    allVideos = videos
    renderVideos(videos)

  } catch (err) {
    container.innerHTML = "Error load data"
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

    let url = "#"

    if (v.source === "vidara") {
      url = `https://vidara.so/v/${v.filecode}`
    } else if (v.source === "dood") {
      url = `https://doodstream.com/d/${v.filecode}`
    }

    div.innerHTML = `
      <img loading="lazy" src="${v.thumbnail}">
      <p>${v.title}</p>
    `

    div.onclick = () => {
      window.location.href = url
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
