let allVideos = []
let firstClick = false

const AD_LINK = "https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1"

async function loadVideos() {
  const container = document.getElementById("videoList")
  container.innerHTML = "Loading..."

  try {
    const res = await fetch("/api/videos", { cache: "no-store" })
    const json = await res.json()

    allVideos = json.result?.videos || []
    renderVideos(allVideos)

  } catch {
    container.innerHTML = "Error load data"
  }
}

function handleClick(url) {
  if (!firstClick) {
    firstClick = true
    window.open(AD_LINK, "_blank")

    setTimeout(() => {
      window.location.href = url
    }, 700)
  } else {
    window.location.href = url
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  videos.forEach((v, i) => {

    // 🔥 IKLAN TIAP 6 VIDEO
    if (i % 6 === 0 && i !== 0) {
      const ad = document.createElement("div")
      ad.className = "banner"
      ad.innerHTML = `
        <a href="${AD_LINK}" target="_blank">🚀 Iklan 🚀</a>
      `
      container.appendChild(ad)
    }

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
      <p>🔥 ${v.title}</p>
    `

    div.onclick = () => handleClick(url)

    container.appendChild(div)
  })
}

// SEARCH
document.getElementById("search").addEventListener("input", e => {
  const key = e.target.value.toLowerCase()
  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(key)
  )
  renderVideos(filtered)
})

loadVideos()
