let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch('/api/videos')
    const json = await res.json()

    // ambil array video
    let videos = []
    if (Array.isArray(json)) videos = json
    else if (json.result?.videos) videos = json.result.videos

    allVideos = videos
    renderVideos(videos)

  } catch (err) {
    container.innerHTML = "Error load data"
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  videos.forEach(v => {
    const div = document.createElement("div")
    div.className = "video"

    const title = v.title || "No title"
    const thumb = v.thumbnail || ""
    const filecode = v.filecode || ""

    // 🔥 DETEKSI LINK
    let finalLink = "#"

    if (v.link?.includes("vidara")) {
      finalLink = `https://vidara.so/v/${filecode}`
    } else if (v.link?.includes("dood")) {
      finalLink = `https://doodstream.com/d/${filecode}`
    }

    div.innerHTML = `
      <img src="${thumb}">
      <p>${title}</p>
    `

    // 🔥 CLICK = REDIRECT
    div.onclick = () => {
      window.location.href = finalLink
    }

    container.appendChild(div)
  })
}

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const key = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v => {
    return (v.title || "").toLowerCase().includes(key)
  })

  renderVideos(filtered)
})

loadVideos()
