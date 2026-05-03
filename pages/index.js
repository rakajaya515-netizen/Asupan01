import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [videos, setVideos] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setVideos(data?.result?.videos || [])
        }
      })
      .catch(() => setError("Gagal load"))
  }, [])

  return (
    <div style={{
      padding: 20,
      background: "#000",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h1>Asupanmu</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {videos.length === 0 && !error && <p>Loading...</p>}

      {videos.map(v => (
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
