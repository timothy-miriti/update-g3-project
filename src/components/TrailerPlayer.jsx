// TrailerPlayer component.
// It appears at the bottom of the app and embeds the selected movie's YouTube trailer.
import { findTrailer } from '../utils/movie'

// Large bottom video player that loads the selected movie's YouTube trailer.
function TrailerPlayer({ loading, movie, playerRef }) {
  // Pick the best trailer or teaser from the selected movie details.
  const trailer = findTrailer(movie)

  if (loading) {
    return (
      <section className="player-section" ref={playerRef}>
        <div className="player-empty">Loading player...</div>
      </section>
    )
  }

  if (!movie) return null

  return (
    <section className="player-section" aria-label="Movie player" ref={playerRef}>
      {/* If a trailer exists, embed it like a YouTube player inside the app. */}
      {trailer ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="main-player"
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
          title={`${movie.title} trailer`}
        />
      ) : (
        <div className="player-empty">No trailer available for this movie.</div>
      )}
      {/* Player title confirms which movie is currently loaded. */}
      <div className="player-info">
        <h2>{movie.title}</h2>
      </div>
    </section>
  )
}

export default TrailerPlayer
