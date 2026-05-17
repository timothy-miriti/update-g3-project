# MovieHub

MovieHub is a React movie discovery app built with Vite. It lets users browse popular and trending movies, search by title, view movie details and trailers, and save movies to a local watchlist.

## Features

- Browse popular movies
- Browse trending movies
- Search movies by title
- View movie details, rating, runtime, cast, and trailer
- Add and remove movies from a watchlist
- Set a planned watch date for saved movies
- Persist the watchlist with `localStorage`
- Navigate between Movies and About pages with React Router
- Manage movie state with Redux Toolkit

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Redux
- React Router DOM
- CSS
- TMDB API

## Project Structure

```txt
src/
  app/
    store.js
  components/
    CategoryFilters.jsx
    Hero.jsx
    MovieCard.jsx
    MovieDetails.jsx
    MovieGrid.jsx
    SearchBar.jsx
    TrailerPlayer.jsx
  features/
    movies/
      moviesSlice.js
  pages/
    About.jsx
    Home.jsx
  api.js
  App.jsx
  main.jsx
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Routes

- `/` - Movie discovery, search, details, trailer, and watchlist tools
- `/about` - Short project information page

## State Management

Redux Toolkit is used for the movie app state in `src/features/movies/moviesSlice.js`.

The slice stores:

- active category
- search query
- loaded movie list
- selected movie ID
- selected movie details
- loading and error states
- watchlist movies

Async thunks load movie lists and movie details from the TMDB API.

## API

Movie data comes from The Movie Database API through `src/api.js`. The app currently uses the API key configured in that file.

## Notes

The watchlist is saved in the browser with authenticated backend environment