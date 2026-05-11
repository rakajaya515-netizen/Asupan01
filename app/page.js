"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [allVideos, setAllVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 20;

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");

        const data = await res.json();

        setAllVideos(data);
        setVideos(data.slice(0, LIMIT));

        // restore scroll
        const savedScroll = sessionStorage.getItem("scroll");

        if (savedScroll) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll));
          }, 100);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchVideos();
  }, []);

  // save scroll
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("scroll", window.scrollY);
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
        document.body.offsetHeight - 800
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  function loadMore() {
    const nextPage = page + 1;

    const nextVideos = allVideos.slice(
      0,
      nextPage * LIMIT
    );

    if (nextVideos.length === videos.length) return;

    setVideos(nextVideos);
    setPage(nextPage);
  }

  function handleSearch(value) {
    setSearch(value);

    if (!value) {
      setVideos(allVideos.slice(0, LIMIT));
      return;
    }

    const filtered = allVideos.filter((video) =>
      video.title
        ?.toLowerCase()
        .includes(value.toLowerCase())
    );

    setVideos(filtered);
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
          onChange={(e) =>
            handleSearch(e.target.value)
          }
        />
      </div>

      <p className="count">
        {videos.length} videos loaded
      </p>

      <div className="grid">
        {videos.map((video) => (
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
              <div className="play">
                ▶
              </div>
            </div>

            <div className="info">
              <h2>{video.title}</h2>

              <div className="meta">
                <span>
                  {video.views || 0} views
                </span>

                <span>
                  {video.duration || 0}s
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
