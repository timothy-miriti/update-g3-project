import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchMovie, fetchPopular, fetchTrending, searchMovies } from '../../api'
import {
  createFavorite,
  createWatchlistItem,
  deleteFavorite,
  deleteWatchlistItem,
  fetchUserLibrary,
  login,
  updateWatchlistItem,
} from '../../services/mockUserApi'

export const loadMovies = createAsyncThunk('movies/loadMovies', async (_, { getState }) => {
  const { category, favorites, query, watchlist } = getState().movies
  const trimmedQuery = query.trim()

  if (category === 'watchlist' && !trimmedQuery) {
    return { results: watchlist, source: 'watchlist' }
  }

  if (category === 'favorites' && !trimmedQuery) {
    return { results: favorites, source: 'favorites' }
  }

  const data = trimmedQuery
    ? await searchMovies(trimmedQuery)
    : await (category === 'trending' ? fetchTrending() : fetchPopular())

  return { results: data.results ?? [], source: trimmedQuery ? 'search' : category }
})

export const loadMovieDetails = createAsyncThunk('movies/loadMovieDetails', async (movieId) => {
  return fetchMovie(movieId)
})

export const loginUser = createAsyncThunk('movies/loginUser', async () => {
  const user = await login()
  const library = await fetchUserLibrary(user.id)

  return { user, ...library }
})

export const toggleWatchlist = createAsyncThunk(
  'movies/toggleWatchlist',
  async (movie, { getState, rejectWithValue }) => {
    const { currentUser, watchlist } = getState().movies
    if (!currentUser) return rejectWithValue('Log in before changing your watchlist.')

    const alreadySaved = watchlist.some((item) => item.id === movie.id)
    if (alreadySaved) {
      const deleted = await deleteWatchlistItem(currentUser.id, movie.id)
      return { action: 'removed', movieId: deleted.id }
    }

    const savedMovie = await createWatchlistItem(currentUser.id, movie)
    return { action: 'added', movie: savedMovie }
  },
)

export const toggleFavorite = createAsyncThunk(
  'movies/toggleFavorite',
  async (movie, { getState, rejectWithValue }) => {
    const { currentUser, favorites } = getState().movies
    if (!currentUser) return rejectWithValue('Log in before changing favorites.')

    const alreadySaved = favorites.some((item) => item.id === movie.id)
    if (alreadySaved) {
      const deleted = await deleteFavorite(currentUser.id, movie.id)
      return { action: 'removed', movieId: deleted.id }
    }

    const savedMovie = await createFavorite(currentUser.id, movie)
    return { action: 'added', movie: savedMovie }
  },
)

export const removeWatchlist = createAsyncThunk(
  'movies/removeWatchlist',
  async (movieId, { getState, rejectWithValue }) => {
    const { currentUser } = getState().movies
    if (!currentUser) return rejectWithValue('Log in before changing your watchlist.')

    const deleted = await deleteWatchlistItem(currentUser.id, movieId)
    return deleted.id
  },
)

export const updateWatchDate = createAsyncThunk(
  'movies/updateWatchDate',
  async ({ movieId, watchDate }, { getState, rejectWithValue }) => {
    const { currentUser } = getState().movies
    if (!currentUser) return rejectWithValue('Log in before changing your watchlist.')

    return updateWatchlistItem(currentUser.id, movieId, { watchDate })
  },
)

const initialState = {
  authLoading: false,
  category: 'popular',
  currentUser: null,
  detailsLoading: false,
  error: '',
  favorites: [],
  favoritesPendingIds: [],
  libraryLoading: false,
  loading: true,
  movies: [],
  query: '',
  selectedId: null,
  selectedMovie: null,
  watchlist: [],
  watchlistPendingIds: [],
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    logoutUser(state) {
      state.category = 'popular'
      state.currentUser = null
      state.favorites = []
      state.movies = []
      state.query = ''
      state.selectedId = null
      state.selectedMovie = null
      state.watchlist = []
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setQuery(state, action) {
      state.query = action.payload
    },
    setSelectedId(state, action) {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state) => {
        state.error = ''
        state.loading = true
      })
      .addCase(loadMovies.fulfilled, (state, action) => {
        const { results, source } = action.payload
        state.loading = false
        state.movies = results

        if (
          (source === 'watchlist' || source === 'favorites') &&
          results.some((movie) => movie.id === state.selectedId)
        ) {
          return
        }

        state.selectedId = results[0]?.id ?? null
        if (!state.selectedId) state.selectedMovie = null
      })
      .addCase(loadMovies.rejected, (state, action) => {
        if (action.meta.aborted) return

        state.error = action.error.message ?? 'Unable to load movies right now.'
        state.loading = false
        state.movies = []
        state.selectedId = null
        state.selectedMovie = null
      })
      .addCase(loadMovieDetails.pending, (state) => {
        state.detailsLoading = true
      })
      .addCase(loadMovieDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.selectedMovie = action.payload
      })
      .addCase(loadMovieDetails.rejected, (state, action) => {
        if (action.meta.aborted) return

        state.detailsLoading = false
        state.selectedMovie = null
      })
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true
        state.error = ''
        state.libraryLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false
        state.libraryLoading = false
        state.currentUser = action.payload.user
        state.favorites = action.payload.favorites
        state.watchlist = action.payload.watchlist
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false
        state.libraryLoading = false
        state.error = action.error.message ?? 'Unable to log in right now.'
      })
      .addCase(toggleWatchlist.pending, (state, action) => {
        state.watchlistPendingIds.push(action.meta.arg.id)
      })
      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        const { action: serverAction, movie, movieId } = action.payload
        const id = movie?.id ?? movieId
        state.watchlistPendingIds = state.watchlistPendingIds.filter((itemId) => itemId !== id)

        if (serverAction === 'removed') {
          state.watchlist = state.watchlist.filter((item) => item.id !== movieId)
          if (state.category === 'watchlist' && !state.query.trim()) {
            state.movies = state.movies.filter((item) => item.id !== movieId)
          }
          return
        }

        state.watchlist = [movie, ...state.watchlist.filter((item) => item.id !== movie.id)]
      })
      .addCase(toggleWatchlist.rejected, (state, action) => {
        state.watchlistPendingIds = state.watchlistPendingIds.filter(
          (itemId) => itemId !== action.meta.arg?.id,
        )
        state.error = action.payload ?? action.error.message ?? 'Unable to update watchlist.'
      })
      .addCase(removeWatchlist.pending, (state, action) => {
        state.watchlistPendingIds.push(action.meta.arg)
      })
      .addCase(removeWatchlist.fulfilled, (state, action) => {
        const movieId = action.payload
        state.watchlistPendingIds = state.watchlistPendingIds.filter((itemId) => itemId !== movieId)
        state.watchlist = state.watchlist.filter((movie) => movie.id !== movieId)
        if (state.category === 'watchlist' && !state.query.trim()) {
          state.movies = state.movies.filter((movie) => movie.id !== movieId)
        }
      })
      .addCase(removeWatchlist.rejected, (state, action) => {
        state.watchlistPendingIds = state.watchlistPendingIds.filter(
          (itemId) => itemId !== action.meta.arg,
        )
        state.error = action.payload ?? action.error.message ?? 'Unable to update watchlist.'
      })
      .addCase(updateWatchDate.pending, (state, action) => {
        state.watchlistPendingIds.push(action.meta.arg.movieId)
      })
      .addCase(updateWatchDate.fulfilled, (state, action) => {
        const updatedMovie = action.payload
        state.watchlistPendingIds = state.watchlistPendingIds.filter(
          (itemId) => itemId !== updatedMovie.id,
        )
        state.watchlist = state.watchlist.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie,
        )
        if (state.category === 'watchlist' && !state.query.trim()) {
          state.movies = state.movies.map((movie) =>
            movie.id === updatedMovie.id ? updatedMovie : movie,
          )
        }
      })
      .addCase(updateWatchDate.rejected, (state, action) => {
        state.watchlistPendingIds = state.watchlistPendingIds.filter(
          (itemId) => itemId !== action.meta.arg.movieId,
        )
        state.error = action.payload ?? action.error.message ?? 'Unable to update watch date.'
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        state.favoritesPendingIds.push(action.meta.arg.id)
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { action: serverAction, movie, movieId } = action.payload
        const id = movie?.id ?? movieId
        state.favoritesPendingIds = state.favoritesPendingIds.filter((itemId) => itemId !== id)

        if (serverAction === 'removed') {
          state.favorites = state.favorites.filter((item) => item.id !== movieId)
          if (state.category === 'favorites' && !state.query.trim()) {
            state.movies = state.movies.filter((item) => item.id !== movieId)
          }
          return
        }

        state.favorites = [movie, ...state.favorites.filter((item) => item.id !== movie.id)]
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.favoritesPendingIds = state.favoritesPendingIds.filter(
          (itemId) => itemId !== action.meta.arg?.id,
        )
        state.error = action.payload ?? action.error.message ?? 'Unable to update favorites.'
      })
  },
})

export const {
  logoutUser,
  setCategory,
  setQuery,
  setSelectedId,
} = moviesSlice.actions

export default moviesSlice.reducer
