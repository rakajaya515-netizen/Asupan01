"use client";
        const json = await res.json();

        console.log("API RESULT:", json);

        // SUPPORT SEMUA FORMAT
        if (Array.isArray(json)) {
          setVideos(json);
        } else if (Array.isArray(json.data)) {
          setVideos(json.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.log(err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <h1 className="logo">Asupanmu</h1>

      <input
        type="text"
        placeholder="Search video..."
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="count">
        {loading ? "Loading..." : `${filteredVideos.length} videos loaded`}
      </p>

      <div className="grid">
        {filteredVideos.map((video) => (
          <a
            key={video.id}
            href={`https://vdeoyy.click/d/${video.id}`}
            target="_blank"
            className="card"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumb"
            />

            <div className="info">
              <h3>{video.title}</h3>
              <p>{video.views || 0} views</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
