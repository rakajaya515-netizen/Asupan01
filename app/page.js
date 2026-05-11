"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [videos, setVideos] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    getVideos()
  }, [])

  async function getVideos() {
    try {
      const res = await fetch("/api/videos")

      const data = await res.json()

      setVideos(data.videos || [])
    } catch (err) {
      console.log(err)
    }
  }

  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-black px-5 py-6">
      <h1 className="text-6xl font-black text-fuchsia-500 mb-8">
        Asupanmu
      </h1>

      <div className="sticky top-0 z-50 bg-black pb-5">
        <input
          type="text"
          placeholder="Search video..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#080811] text-white p-5 rounded-full outline-none text-2xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredVideos.map((video) => (
          <a
            key={video.id}
            href={`https://vdeeyy.click/d/${video.id}`}
            target="_blank"
            className="bg-[#0b0b12] rounded-[30px] overflow-hidden"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-[320px] object-cover"
            />

            <div className="p-4">
              <h2 className="text-white text-2xl font-bold line-clamp-2">
                {video.title}
              </h2>

              <p className="text-fuchsia-400 mt-3 text-xl">
                vizey
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center text-3xl py-10">
        {filteredVideos.length} videos loaded
      </div>
    </main>
  )
          }
