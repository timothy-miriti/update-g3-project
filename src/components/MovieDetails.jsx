// MovieDetails component.
// It shows extra information for the selected movie, such as rating, facts, cast,
// and a button for adding or removing the movie from the watchlist.
import { movieRating, movieYear } from '../utils/movie'

// Side panel that shows selected movie facts, rating, cast, and watchlist action.
function MovieDetails({ loading, movie, onToggleWatchlist, watchlisted }) {
  // Only show the first few cast members to keep the details panel compact.
  const cast = movie?.credits?.cast?.slice(0, 5) ?? []

  return (
    <aside className="details" aria-live="polite">
      {loading && <p className="status">Loading details...</p>}
      {!loading && movie && (
        <>
          {/* Header shows release year, title, and rating score. */}
          <div className="details-header">
            <div>
              <p className="eyebrow">{movieYear(movie.release_date)}</p>
              <h2>{movie.title}</h2>
            </div>
            <span className="score">{movieRating(movie.vote_average)}</span>
          </div>
          {/* Toggles whether this movie is saved for later. */}
          <button
            className="watchlist-action"
            onClick={() => onToggleWatchlist(movie)}
            type="button"
          >
            {watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
          {/* Quick facts about the selected movie. */}
          <div className="facts">
            <span>{movie.runtime ? `${movie.runtime} min` : 'Runtime TBA'}</span>
            <span>{movie.genres?.[0]?.name ?? 'Movie'}</span>
            <span>{movie.vote_count?.toLocaleString() ?? 0} votes</span>
          </div>
          {/* Cast appears only when TMDB returns cast data. */}
          {cast.length > 0 && (
            <div className="cast">
              <p className="section-label">Cast</p>
              {cast.map((person) => (
                <span key={person.cast_id ?? person.id}>{person.name}</span>
              ))}
            </div>
          )}
        </>
      )}
    </aside>
  )
}

export default MovieDetails
