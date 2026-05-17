const REQUEST_DELAY = 500

const demoUser = {
  id: 'demo-user',
  name: 'Maya',
}

const database = {
  [demoUser.id]: {
    favorites: [],
    watchlist: [],
  },
}

function wait(response) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(response)), REQUEST_DELAY)
  })
}

function libraryFor(userId) {
  if (!database[userId]) {
    database[userId] = {
      favorites: [],
      watchlist: [],
    }
  }

  return database[userId]
}

function toLibraryMovie(movie) {
  return {
    backdrop_path: movie.backdrop_path,
    id: movie.id,
    overview: movie.overview,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    title: movie.title,
    vote_average: movie.vote_average,
  }
}

export async function login() {
  return wait(demoUser)
}

export async function fetchUserLibrary(userId) {
  const library = libraryFor(userId)

  // Mock GET /api/watchlist and GET /api/favorites for the signed-in user.
  return wait({
    favorites: library.favorites,
    watchlist: library.watchlist,
  })
}

export async function createWatchlistItem(userId, movie) {
  const library = libraryFor(userId)
  const savedMovie = {
    ...toLibraryMovie(movie),
    watchDate: '',
  }

  // Mock POST /api/watchlist.
  library.watchlist = [
    savedMovie,
    ...library.watchlist.filter((item) => item.id !== savedMovie.id),
  ]

  return wait(savedMovie)
}

export async function deleteWatchlistItem(userId, movieId) {
  const library = libraryFor(userId)

  // Mock DELETE /api/watchlist/:id.
  library.watchlist = library.watchlist.filter((movie) => movie.id !== movieId)

  return wait({ id: movieId })
}

export async function updateWatchlistItem(userId, movieId, updates) {
  const library = libraryFor(userId)

  // Mock PATCH /api/watchlist/:id.
  library.watchlist = library.watchlist.map((movie) =>
    movie.id === movieId ? { ...movie, ...updates } : movie,
  )

  return wait(library.watchlist.find((movie) => movie.id === movieId))
}

export async function createFavorite(userId, movie) {
  const library = libraryFor(userId)
  const savedMovie = toLibraryMovie(movie)

  // Mock POST /api/favorites.
  library.favorites = [
    savedMovie,
    ...library.favorites.filter((item) => item.id !== savedMovie.id),
  ]

  return wait(savedMovie)
}

export async function deleteFavorite(userId, movieId) {
  const library = libraryFor(userId)

  // Mock DELETE /api/favorites/:id.
  library.favorites = library.favorites.filter((movie) => movie.id !== movieId)

  return wait({ id: movieId })
}
