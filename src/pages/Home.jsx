import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Hero from '../components/Hero'
import MovieDetails from '../components/MovieDetails'
import MovieGrid from '../components/MovieGrid'
import TrailerPlayer from '../components/TrailerPlayer'
import {
  loginUser,
  loadMovieDetails,
  loadMovies,
  logoutUser,
  removeWatchlist,
  setCategory,
  setQuery,
  setSelectedId,
  toggleFavorite,
  toggleWatchlist,
  updateWatchDate,
} from '../features/movies/moviesSlice'

const CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'favorites', label: 'Favorites' },
]

export default function Home() {
  const dispatch = useDispatch()
  const playerRef = useRef(null)
  const {
    authLoading,
    category,
    currentUser,
    detailsLoading,
    error,
    favorites,
    favoritesPendingIds,
    libraryLoading,
    loading,
    movies,
    query,
    selectedId,
    selectedMovie,
    watchlist,
    watchlistPendingIds,
  } = useSelector((state) => state.movies)

  const activeCategory = useMemo(
    () => CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[0],
    [category],
  )
  const isWatchlist = category === 'watchlist' && !query.trim()
  const isFavorites = category === 'favorites' && !query.trim()
  const watchlistIds = useMemo(() => new Set(watchlist.map((movie) => movie.id)), [watchlist])
  const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites])
  const watchlistPendingSet = useMemo(
    () => new Set(watchlistPendingIds),
    [watchlistPendingIds],
  )
  const favoritesPendingSet = useMemo(
    () => new Set(favoritesPendingIds),
    [favoritesPendingIds],
  )
  const selectedIsWatchlisted = selectedMovie ? watchlistIds.has(selectedMovie.id) : false
  const selectedIsFavorite = selectedMovie ? favoriteIds.has(selectedMovie.id) : false
  const hero = selectedMovie ?? movies[0]
  const heroActionPending = hero
    ? watchlistPendingSet.has(hero.id) || favoritesPendingSet.has(hero.id)
    : false
  const libraryVersion = isWatchlist
    ? JSON.stringify(watchlist)
    : isFavorites
      ? JSON.stringify(favorites)
      : ''

  useEffect(() => {
    let request
    const timeoutId = window.setTimeout(() => {
      request = dispatch(loadMovies())
    }, query.trim() ? 350 : 0)

    return () => {
      window.clearTimeout(timeoutId)
      request?.abort()
    }
  }, [category, dispatch, libraryVersion, query])

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
        currentUser={currentUser}
        authLoading={authLoading}
        disabledActions={!currentUser || libraryLoading || heroActionPending}
        favorite={hero ? favoriteIds.has(hero.id) : false}
        hero={hero}
        onFavorite={(movie) => dispatch(toggleFavorite(movie))}
        onCategoryChange={(nextCategory) => dispatch(setCategory(nextCategory))}
        onLogin={() => dispatch(loginUser())}
        onLogout={() => dispatch(logoutUser())}
        onQueryChange={(nextQuery) => dispatch(setQuery(nextQuery))}
        onSelectHero={handleSelectMovie}
        onToggleWatchlist={(movie) => dispatch(toggleWatchlist(movie))}
        query={query}
        watchlisted={hero ? watchlistIds.has(hero.id) : false}
      />

      <section className="content">
        {error && <p className="status error">{error}</p>}
        {(loading || libraryLoading) && <p className="status">Loading movies...</p>}

        {!loading && !libraryLoading && !error && (
          <>
            <div className="workspace">
              <MovieGrid
                isWatchlist={isWatchlist}
                isFavorites={isFavorites}
                movies={movies}
                onRemoveWatchlist={(movieId) => dispatch(removeWatchlist(movieId))}
                onSelectMovie={handleSelectMovie}
                onUpdateWatchDate={(movieId, watchDate) =>
                  dispatch(updateWatchDate({ movieId, watchDate }))
                }
                selectedId={selectedId}
                watchlistPendingIds={watchlistPendingIds}
              />
              <MovieDetails
                disabledActions={
                  !currentUser ||
                  libraryLoading ||
                  (selectedMovie
                    ? watchlistPendingSet.has(selectedMovie.id) ||
                      favoritesPendingSet.has(selectedMovie.id)
                    : false)
                }
                favorite={selectedIsFavorite}
                loading={detailsLoading}
                movie={selectedMovie}
                onToggleFavorite={(movie) => dispatch(toggleFavorite(movie))}
                onToggleWatchlist={(movie) => dispatch(toggleWatchlist(movie))}
                signedIn={Boolean(currentUser)}
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
