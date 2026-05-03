let allVideos = []

async function loadVideos() {
  try {
    const res = await fetch('/api/videos')
    const data = await res.json()

    // sesuaikan struktur API kamu
    allVideos = data.data || data

    renderVideos(allVideos)

  } catch (err) {
    document.getElementById("videoList").innerHTML = "Error load"
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  videos.forEach(v => {
    const div = document.createElement("div")
    div.style.marginBottom = "20px"

    div.innerHTML = `
      <p>${v.title || 'No Title'}</p>
      <video src="${v.url}" controls width="300"></video>
    `

    container.appendChild(div)
  })
}

// 🔍 SEARCH FUNCTION
document.getElementById("search").addEventListener("input", function(e) {
  const keyword = e.target.value.toLowerCase()

  const filtered = allVideos.filter(v => {
    return (v.title || "").toLowerCase().includes(keyword)
  })

  renderVideos(filtered)
})

// 🚀 load awal
loadVideos()
