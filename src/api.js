
const BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Shared helper for calling TMDB endpoints with the API key and query parameters.
async function fetchJSON(path, params = {}) {
  if (!API_KEY) {
    throw new Error("Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.");
  }

  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);

  // Only add parameters that have a real value so the API URL stays clean.
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Unable to load movies right now.");
  return res.json();
}

// Gets the popular movie list.
export async function fetchPopular(page = 1) {
  return fetchJSON("/movie/popular", { page });
}

// Gets movies trending this week.
export async function fetchTrending() {
  return fetchJSON("/trending/movie/week");
}

// Gets top rated movies. Kept available if you want to add the filter back later.
export async function fetchTopRated(page = 1) {
  return fetchJSON("/movie/top_rated", { page });
}

// Gets movies currently playing in theaters. Kept available for future use.
export async function fetchNowPlaying(page = 1) {
  return fetchJSON("/movie/now_playing", { page });
}

// Gets full details for one movie, including cast and trailer videos.
export async function fetchMovie(id) {
  return fetchJSON(`/movie/${id}`, { append_to_response: "credits,videos" });
}

// Searches movies by the text typed into the search bar.
export async function searchMovies(query, page = 1) {
  return fetchJSON("/search/movie", { query, page });
}
