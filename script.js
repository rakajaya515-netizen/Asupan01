let allVideos = []

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch('/api/videos')

    const text = await res.text()
    console.log("RAW RESPONSE:", text)

    let json
    try {
      json = JSON.parse(text)
    } catch {
      container.innerHTML = "Response bukan JSON:<br>" + text
      return
    }

    console.log("JSON:", json)

    // 🔥 HANDLE SEMUA FORMAT
    if (Array.isArray(json)) {
      allVideos = json
    } else if (Array.isArray(json.data)) {
      allVideos = json.data
    } else if (Array.isArray(json.result)) {
      allVideos = json.result
    } else if (Array.isArray(json.videos)) {
      allVideos = json.videos
    } else {
      // ❗ tampilkan isi biar kita tahu struktur asli
      container.innerHTML = `
        Format tidak dikenali:<br><pre>${JSON.stringify(json, null, 2)}</pre>
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

    // 🔥 coba semua kemungkinan field
    const title = v.title || v.name || v.caption || "No Title"
    const url = v.url || v.video || v.play || v.link || ""

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
    const text = (v.title || v.name || v.caption || "").toLowerCase()
    return text.includes(keyword)
  })

  renderVideos(filtered)
})

// 🚀 START
loadVideos()
