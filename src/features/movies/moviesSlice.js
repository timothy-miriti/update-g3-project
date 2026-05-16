import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchMovie, fetchPopular, fetchTrending, searchMovies } from '../../api'

const WATCHLIST_KEY = 'moviehub-watchlist'

function readWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveWatchlist(watchlist) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
}

export const loadMovies = createAsyncThunk('movies/loadMovies', async (_, { getState }) => {
  const { category, query, watchlist } = getState().movies
  const trimmedQuery = query.trim()

  if (category === 'watchlist' && !trimmedQuery) {
    return { results: watchlist, source: 'watchlist' }
  }

  const data = trimmedQuery
    ? await searchMovies(trimmedQuery)
    : await (category === 'trending' ? fetchTrending() : fetchPopular())

  return { results: data.results ?? [], source: trimmedQuery ? 'search' : category }
})

export const loadMovieDetails = createAsyncThunk('movies/loadMovieDetails', async (movieId) => {
  return fetchMovie(movieId)
})

const initialState = {
  category: 'popular',
  detailsLoading: false,
  error: '',
  loading: true,
  movies: [],
  query: '',
  selectedId: null,
  selectedMovie: null,
  watchlist: readWatchlist(),
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    removeWatchlist(state, action) {
      state.watchlist = state.watchlist.filter((movie) => movie.id !== action.payload)
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
    toggleWatchlist(state, action) {
      const movie = action.payload
      if (!movie) return

      const alreadySaved = state.watchlist.some((item) => item.id === movie.id)
      if (alreadySaved) {
        state.watchlist = state.watchlist.filter((item) => item.id !== movie.id)
        return
      }

      state.watchlist.unshift({
        backdrop_path: movie.backdrop_path,
        id: movie.id,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        title: movie.title,
        vote_average: movie.vote_average,
        watchDate: '',
      })
    },
    updateWatchDate(state, action) {
      const { movieId, watchDate } = action.payload
      const movie = state.watchlist.find((item) => item.id === movieId)
      if (movie) movie.watchDate = watchDate
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

        if (source === 'watchlist' && results.some((movie) => movie.id === state.selectedId)) {
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
  },
})

export const {
  removeWatchlist,
  setCategory,
  setQuery,
  setSelectedId,
  toggleWatchlist,
  updateWatchDate,
} = moviesSlice.actions

export default moviesSlice.reducer
