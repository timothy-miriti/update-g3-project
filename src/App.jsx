// Main app file.
// It controls category browsing, searching, selected movie details, watchlist storage,
// and the smooth scroll to the trailer player at the bottom of the page.
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  fetchMovie,
  fetchPopular,
  fetchTrending,
  searchMovies,
} from './api'
import Hero from './components/Hero'
import MovieDetails from './components/MovieDetails'
import MovieGrid from './components/MovieGrid'
import TrailerPlayer from './components/TrailerPlayer'

const CATEGORIES = [
  { id: 'popular', label: 'Popular', loader: fetchPopular },
  { id: 'trending', label: 'Trending', loader: fetchTrending },
  { id: 'watchlist', label: 'Watchlist' },
]

const WATCHLIST_KEY = 'moviehub-watchlist'

// Reads saved watchlist movies from localStorage when the app starts.
function readWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) ?? []
  } catch {
    return []
  }
}

function App() {
  // Used to scroll down to the bottom video player when a movie is selected.
  const playerRef = useRef(null)

  // Main app state for categories, search, movie lists, selected movie, and loading states.
  const [category, setCategory] = useState('popular')
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [watchlist, setWatchlist] = useState(readWatchlist)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')

  // Finds the current active category object from the selected category id.
  const activeCategory = useMemo(
    () => CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[0],
    [category],
  )

  // These derived values help the UI know when it is showing saved movies.
  const isWatchlist = category === 'watchlist' && !query.trim()
  const watchlistIds = useMemo(() => new Set(watchlist.map((movie) => movie.id)), [watchlist])
  const selectedIsWatchlisted = selectedMovie ? watchlistIds.has(selectedMovie.id) : false

  // Loads movies whenever the category, search query, or watchlist changes.
  useEffect(() => {
    let ignore = false

    async function loadMovies() {
      // Watchlist movies come from localStorage instead of the API.
      if (isWatchlist) {
        setLoading(false)
        setError('')
        setMovies(watchlist)
        setSelectedId((currentId) => {
          if (watchlist.some((movie) => movie.id === currentId)) return currentId
          return watchlist[0]?.id ?? null
        })
        return
      }

      setLoading(true)
      setError('')

      try {
        const trimmedQuery = query.trim()
        // Search uses the search endpoint; otherwise the selected category loader runs.
        const data = trimmedQuery
          ? await searchMovies(trimmedQuery)
          : await activeCategory.loader()
        const results = data.results ?? []

        if (!ignore) {
          setMovies(results)
          setSelectedId(results[0]?.id ?? null)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          setMovies([])
          setSelectedId(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    // Debounce search slightly so the app does not call the API on every keystroke immediately.
    const timeoutId = setTimeout(loadMovies, query.trim() ? 350 : 0)
    return () => {
      ignore = true
      clearTimeout(timeoutId)
    }
  }, [activeCategory, isWatchlist, query, watchlist])

  // Saves watchlist changes so they remain after refreshing the browser.
  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  }, [watchlist])

  // Loads full movie details after the selected movie changes.
  useEffect(() => {
    let ignore = false

    async function loadDetails() {
      if (!selectedId) {
        setSelectedMovie(null)
        return
      }

      setDetailsLoading(true)
      try {
        const data = await fetchMovie(selectedId)
        if (!ignore) setSelectedMovie(data)
      } catch {
        if (!ignore) setSelectedMovie(null)
      } finally {
        if (!ignore) setDetailsLoading(false)
      }
    }

    loadDetails()
    return () => {
      ignore = true
    }
  }, [selectedId])

  // The hero uses the selected movie when available, otherwise the first movie in the list.
  const hero = selectedMovie ?? movies[0]

  // Adds a movie to the watchlist, or removes it if it is already saved.
  function handleToggleWatchlist(movie) {
    if (!movie) return

    setWatchlist((currentWatchlist) => {
      if (currentWatchlist.some((item) => item.id === movie.id)) {
        return currentWatchlist.filter((item) => item.id !== movie.id)
      }

      const savedMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        watchDate: '',
      }

      return [savedMovie, ...currentWatchlist]
    })
  }

  // Deletes one movie from the watchlist.
  function handleRemoveWatchlist(movieId) {
    setWatchlist((currentWatchlist) => currentWatchlist.filter((movie) => movie.id !== movieId))
  }

  // Updates the planned date for watching a saved movie.
  function handleUpdateWatchDate(movieId, watchDate) {
    setWatchlist((currentWatchlist) =>
      currentWatchlist.map((movie) => (movie.id === movieId ? { ...movie, watchDate } : movie)),
    )
  }

  // Selects a movie and smoothly scrolls to the bottom video player.
  function handleSelectMovie(movieId) {
    setSelectedId(movieId)
    window.setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <main className="app">
      <Hero
        categories={CATEGORIES}
        category={category}
        categoryLabel={activeCategory.label}
        hero={hero}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
        onSelectHero={handleSelectMovie}
        onToggleWatchlist={handleToggleWatchlist}
        query={query}
        watchlisted={hero ? watchlistIds.has(hero.id) : false}
      />

      <section className="content">
        {error && <p className="status error">{error}</p>}
        {loading && <p className="status">Loading movies...</p>}

        {!loading && !error && (
          <>
            <div className="workspace">
              <MovieGrid
                isWatchlist={isWatchlist}
                movies={movies}
                onRemoveWatchlist={handleRemoveWatchlist}
                onSelectMovie={handleSelectMovie}
                onUpdateWatchDate={handleUpdateWatchDate}
                selectedId={selectedId}
              />
              <MovieDetails
                loading={detailsLoading}
                movie={selectedMovie}
                onToggleWatchlist={handleToggleWatchlist}
                watchlisted={selectedIsWatchlisted}
              />
            </div>
            <TrailerPlayer loading={detailsLoading} movie={selectedMovie} playerRef={playerRef} />
          </>
        )}
      </section>
    </main>
  )
}

export default App
