import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Watch() {
  const router = useRouter()
  const { filecode } = router.query

  const [video, setVideo] = useState(null)

  useEffect(() => {
    if (!filecode) return

    fetch(`/api/video?filecode=${filecode}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)

        setVideo(data?.result?.[0] ?? null)
      })
  }, [filecode])

  if (!video) return <p style={{ color: "#fff" }}>Loading...</p>

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: 20 }}>
      <h2>{video.video_title}</h2>

      <video
        controls
        autoPlay
        style={{ width: "100%", borderRadius: 10 }}
        poster={video.player_img}
      >
        <source src={video.link} type="video/mp4" />
      </video>

      <p>{video.video_views} views</p>
    </div>
  )
}
