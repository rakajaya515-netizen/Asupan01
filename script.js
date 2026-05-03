let allVideos = []

const AD_LINK = "https://www.profitablecpmratenetwork.com/s6szeryj1j?key=67a910e3b4387aa420b25f4a4bfa41b1"

// 🔥 HANDLE CLICK (IKLAN 1x)
function handleClick(url) {
  const adsShown = sessionStorage.getItem("adsShown")

  if (!adsShown) {
    sessionStorage.setItem("adsShown", "true")

    // buka iklan
    window.open(AD_LINK, "_blank")

    // delay lalu buka video
    setTimeout(() => {
      window.open(url, "_blank")
    }, 500)

  } else {
    // langsung video
    window.open(url, "_blank")
  }
}

async function loadVideos() {
  const container = document.getElementById("videoList")

  try {
    const res = await fetch("/api/videos", { cache: "no-store" })
    const json = await res.json()

    allVideos = json.result?.videos || []
    renderVideos(allVideos)

  } catch {
    container.innerHTML = "Error load data"
  }
}

function renderVideos(videos) {
  const container = document.getElementById("videoList")
  container.innerHTML = ""

  videos.forEach((v, i) => {

    // 🔥 iklan tiap 6 video (ringan)
    if (i % 6 === 0 && i !== 0) {
      const ad = document.createElement("div")
      ad.className = "banner"
      ad.innerHTML = `<a href="${AD_LINK}" target="_blank">🚀 Iklan 🚀</a>`
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
