// Movie utility file.
// These helper functions format movie data before components display it.
import { IMAGE_BASE } from '../api'

// Builds a full TMDB image URL from a poster or backdrop path.
export function imageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null
}

// Converts a release date into just the release year.
export function movieYear(date) {
  return date ? new Date(date).getFullYear() : 'TBA'
}

// Formats the movie rating to one decimal place.
export function movieRating(value) {
  return value ? value.toFixed(1) : 'New'
}

// Finds a YouTube trailer or teaser from the videos returned by TMDB.
export function findTrailer(movie) {
  return movie?.videos?.results?.find(
    (video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type),
  )
}
