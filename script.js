let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch('/api/videos')

    // ❗ kalau API error
    if (!res.ok) {
      const text = await res.text()
      container.innerHTML = "Error API: " + text
      return
    }

    const data = await res.json()

    console.log("DATA:", data)

    // 🔥 fleksibel (biar gak error lagi)
    if (Array.isArray(data)) {
      allVideos = data
    } else if (Array.isArray(data.data)) {
      allVideos = data.data
    } else {
      container.innerHTML = "Format data tidak dikenali"
      return
    }

    renderVideos(allVideos)

  } catch (err) {
    container.innerHTML = "Error load: " + err.message
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")

  if (videos.length === 0) {
    container.innerHTML = "Tidak ada video"
    return
  }

  container.innerHTML = ""

  videos.forEach(v => {
    const div = document.createElement("div")
    div.className = "video"

    // 🔥 fallback aman
    const title = v.title || v.name || "No Title"
    const url = v.url || v.video || v.link || ""

    div.innerHTML = `
      <p>${title}</p>
      <video src="${url}" controls></video>
    `

    container.appendChild(div)
  })
}

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", function(e) {
  const keyword = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v => {
    const text = (v.title || v.name || "").toLowerCase()
    return text.includes(keyword)
  })

  renderVideos(filtered)
})

// 🚀 START
loadVideos()
