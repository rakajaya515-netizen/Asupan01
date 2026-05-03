import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch('/api/videos')
  .then(res => res.json())
  .then(data => {
    console.log("DATA:", data)

    if (data.error) {
      console.log("ERROR:", data.error)
    }

    setVideos(data?.result?.videos ?? [])
   })
  }, [])

  return (
    <div style={{ padding: 20, background: "#000", minHeight: "100vh", color: "#fff" }}>
      <h1>Asupanmu</h1>

      {videos.length === 0 && <p>Data kosong</p>}

      {videos.map((v) => (
        <Link key={v.filecode} href={`/watch?filecode=${v.filecode}`}>
          <div style={{
            marginBottom: 20,
            border: "1px solid #333",
            padding: 10,
            borderRadius: 10,
            cursor: "pointer"
          }}>
            <img
              src={v.thumbnail}
              style={{ width: "100%", borderRadius: 10 }}
            />

            <h3>{v.title}</h3>
            <p>{v.views} views</p>
          </div>
        </Link>
      ))}
    </div>
  )
              }
