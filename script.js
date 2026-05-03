let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch("/api/videos")
    const data = await res.json()

    console.log("JSON:", data)

    // ✅ FIX UTAMA
    if (data.result && Array.isArray(data.result.videos)) {
      allVideos = data.result.videos
    } else if (Array.isArray(data)) {
      allVideos = data
    } else {
      container.innerHTML = `
        Format tidak dikenali:
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
      return
    }

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

    const title = v.title || "No Title"
    const thumb = v.thumbnail
    const link = v.link

    div.innerHTML = `
      <a href="${link}" target="_blank">
        <img src="${thumb}" />
      </a>
      <p>${title}</p>
    `

    container.appendChild(div)
  })
}

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v =>
    (v.title || "").toLowerCase().includes(keyword)
  )

  renderVideos(filtered)
})

loadVideos()
