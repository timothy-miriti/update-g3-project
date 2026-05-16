import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Hero from '../components/Hero'
import MovieDetails from '../components/MovieDetails'
import MovieGrid from '../components/MovieGrid'
import TrailerPlayer from '../components/TrailerPlayer'
import {
  loadMovieDetails,
  loadMovies,
  removeWatchlist,
  saveWatchlist,
  setCategory,
  setQuery,
  setSelectedId,
  toggleWatchlist,
  updateWatchDate,
} from '../features/movies/moviesSlice'

const CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
  { id: 'watchlist', label: 'Watchlist' },
]

export default function Home() {
  const dispatch = useDispatch()
  const playerRef = useRef(null)
  const {
    category,
    detailsLoading,
    error,
    loading,
    movies,
    query,
    selectedId,
    selectedMovie,
    watchlist,
  } = useSelector((state) => state.movies)

  const activeCategory = useMemo(
    () => CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[0],
    [category],
  )
  const isWatchlist = category === 'watchlist' && !query.trim()
  const watchlistIds = useMemo(() => new Set(watchlist.map((movie) => movie.id)), [watchlist])
  const selectedIsWatchlisted = selectedMovie ? watchlistIds.has(selectedMovie.id) : false
  const hero = selectedMovie ?? movies[0]

  useEffect(() => {
    let request
    const timeoutId = window.setTimeout(() => {
      request = dispatch(loadMovies())
    }, query.trim() ? 350 : 0)

    return () => {
      window.clearTimeout(timeoutId)
      request?.abort()
    }
  }, [category, dispatch, query, watchlist])

  useEffect(() => {
    saveWatchlist(watchlist)
  }, [watchlist])

  useEffect(() => {
    if (!selectedId) return

    const request = dispatch(loadMovieDetails(selectedId))
    return () => request.abort()
  }, [dispatch, selectedId])

  function handleSelectMovie(movieId) {
    dispatch(setSelectedId(movieId))
    window.setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <>
      <Hero
        categories={CATEGORIES}
        category={category}
        categoryLabel={activeCategory.label}
        hero={hero}
        onCategoryChange={(nextCategory) => dispatch(setCategory(nextCategory))}
        onQueryChange={(nextQuery) => dispatch(setQuery(nextQuery))}
        onSelectHero={handleSelectMovie}
        onToggleWatchlist={(movie) => dispatch(toggleWatchlist(movie))}
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
                onRemoveWatchlist={(movieId) => dispatch(removeWatchlist(movieId))}
                onSelectMovie={handleSelectMovie}
                onUpdateWatchDate={(movieId, watchDate) =>
                  dispatch(updateWatchDate({ movieId, watchDate }))
                }
                selectedId={selectedId}
              />
              <MovieDetails
                loading={detailsLoading}
                movie={selectedMovie}
                onToggleWatchlist={(movie) => dispatch(toggleWatchlist(movie))}
                watchlisted={selectedIsWatchlisted}
              />
            </div>
            <TrailerPlayer loading={detailsLoading} movie={selectedMovie} playerRef={playerRef} />
          </>
        )}
      </section>
    </>
  )
}
