// MovieCard component.
// It shows a poster, title, release year, and rating for one movie.
// In Watchlist mode it also shows edit, save, and delete controls.
import { useState } from 'react'
import { imageUrl, movieRating, movieYear } from '../utils/movie'

// Single movie card. In Watchlist mode it also lets the user edit dates or delete the movie.
function MovieCard({
  movie,
  active,
  isWatchlist,
  onRemoveWatchlist,
  onSelect,
  onUpdateWatchDate,
}) {
  // Local state controls the temporary date edit form on watchlist cards.
  const [editingDate, setEditingDate] = useState(false)
  const [watchDate, setWatchDate] = useState(movie.watchDate ?? '')

  // Saves the chosen watch date back into the watchlist stored in App.jsx.
  function handleSaveDate() {
    onUpdateWatchDate(movie.id, watchDate)
    setEditingDate(false)
  }

  return (
    <article className={`movie-card ${active ? 'is-active' : ''}`}>
      {/* Poster button selects the movie and loads its trailer in the player. */}
      <button className="movie-card-main" onClick={() => onSelect(movie.id)} type="button">
        <span className="poster-frame">
          {movie.poster_path ? (
            <img alt={`${movie.title} poster`} src={imageUrl(movie.poster_path, 'w342')} />
          ) : (
            <span className="poster-empty">No poster</span>
          )}
        </span>
      </button>
      {/* Title/rating button also selects the movie for keyboard and screen-reader users. */}
      <button className="movie-info-button" onClick={() => onSelect(movie.id)} type="button">
        <span className="movie-title">{movie.title}</span>
        <span className="movie-meta">
          <span>{movieYear(movie.release_date)}</span>
          <span>{movieRating(movie.vote_average)}</span>
        </span>
      </button>

      {isWatchlist && (
        <div className="watchlist-tools">
          {/* Shows the planned date, or a prompt when no date has been saved yet. */}
          <p className="watch-date">
            {movie.watchDate ? `Watch on ${movie.watchDate}` : 'No watch date set'}
          </p>
          {/* Edit mode reveals a date input so the user can plan when to watch. */}
          {editingDate && (
            <label className="watch-date-field">
              <span>Watch date</span>
              <input
                onChange={(event) => setWatchDate(event.target.value)}
                type="date"
                value={watchDate}
              />
            </label>
          )}
          <div className="watchlist-buttons">
            {/* Save stores the date; Edit opens the date picker. */}
            {editingDate ? (
              <button className="mini-action" onClick={handleSaveDate} type="button">
                Save
              </button>
            ) : (
              <button className="mini-action" onClick={() => setEditingDate(true)} type="button">
                Edit
              </button>
            )}
            {/* Delete removes this movie from the watchlist. */}
            <button
              className="mini-action danger"
              onClick={() => onRemoveWatchlist(movie.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default MovieCard
