"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();

        setVideos(data);
        setVisibleVideos(data.slice(0, 20));

        // restore scroll
        const savedScroll = sessionStorage.getItem("scrollY");

        if (savedScroll) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll));
          }, 100);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadVideos();
  }, []);

  // save scroll position
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("scrollY", window.scrollY);
    };

    window.addEventListener("scroll", saveScroll);

    return () => {
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setVisibleVideos((prev) => {
          const next = videos.slice(0, prev.length + 20);

          if (next.length === prev.length) {
            return prev;
          }

          return next;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [videos]);

  function handleSearch(value) {
    setSearch(value);

    if (!value) {
      setVisibleVideos(videos.slice(0, 20));
      return;
    }

    const filtered = videos.filter((video) =>
      video.title?.toLowerCase().includes(value.toLowerCase())
    );

    setVisibleVideos(filtered);
  }

  return (
    <main className="main">
      <div className="navbar">
        <h1 className="logo">Asupanmu</h1>

        <input
          type="text"
          placeholder="Search video..."
          className="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <p className="count">
        {visibleVideos.length} videos loaded
      </p>

      <div className="grid">
        {visibleVideos.map((video) => (
          <a
            key={video.id}
            href={`https://videy.co/v/?id=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumb"
              loading="lazy"
            />

            <div className="overlay">
              <div className="play">▶</div>
            </div>

            <div className="info">
              <h2>{video.title}</h2>

              <div className="meta">
                <span>{video.views || 0} views</span>
                <span>{video.duration || 0}s</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}        
