// MovieGrid component.
// It receives an array of movies and renders one MovieCard for each movie.
import MovieCard from './MovieCard'

// Displays the current movie list as cards.
function MovieGrid({
  isWatchlist,
  movies,
  selectedId,
  onRemoveWatchlist,
  onSelectMovie,
  onUpdateWatchDate,
}) {
  return (
    <section className="movie-grid" aria-label="Movies">
      {movies.map((movie) => (
        // Each card can select a movie, and watchlist cards also expose edit/delete tools.
        <MovieCard
          active={selectedId === movie.id}
          isWatchlist={isWatchlist}
          key={movie.id}
          movie={movie}
          onRemoveWatchlist={onRemoveWatchlist}
          onSelect={onSelectMovie}
          onUpdateWatchDate={onUpdateWatchDate}
        />
      ))}
      {/* Empty state changes depending on whether the user is browsing or viewing the watchlist. */}
      {movies.length === 0 && (
        <p className="status">
          {isWatchlist ? 'Your watchlist is empty. Save a movie to watch later.' : 'No movies found.'}
        </p>
      )}
    </section>
  )
}

export default MovieGrid
