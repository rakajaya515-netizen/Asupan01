import { useRouter } from "next/router"

export default function Watch() {
  const router = useRouter()
  const { filecode } = router.query

  if (!filecode) return <p>Loading...</p>

  const videoUrl = `https://vidara.so/${filecode}`

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      minHeight: "100vh",
      padding: 20
    }}>
      <h2>Video Player</h2>

      <div style={{ marginTop: 20 }}>
        <iframe
          src={videoUrl}
          width="100%"
          height="500"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  )
}
