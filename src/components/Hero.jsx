// Hero component.
// This is the top area of the app with the title, category navbar, search bar,
// selected movie title, and watchlist/detail buttons.
import CategoryFilters from './CategoryFilters'
import SearchBar from './SearchBar'
import { imageUrl } from '../utils/movie'

// Top hero section with the app title, category navigation, search, and main movie actions.
function Hero({
  authLoading,
  categories,
  category,
  categoryLabel,
  currentUser,
  disabledActions,
  favorite,
  hero,
  onCategoryChange,
  onFavorite,
  onLogin,
  onLogout,
  onSelectHero,
  onToggleWatchlist,
  query,
  onQueryChange,
  watchlisted,
}) {
  return (
    <section
      className="hero"
      style={{
        // Uses the selected movie backdrop as the hero background when TMDB provides one.
        backgroundImage: hero?.backdrop_path
          ? `linear-gradient(90deg, rgba(7, 10, 19, 0.92), rgba(7, 10, 19, 0.5), rgba(7, 10, 19, 0.2)), url(${imageUrl(hero.backdrop_path, 'w1280')})`
          : undefined,
      }}
    >
      <nav className="topbar" aria-label="Movie navigation">
        <div>
          <p className="eyebrow">MovieHub</p>
          <h1>Find your next watch</h1>
        </div>
        <div className="nav-actions">
          <div className="account-actions">
            {currentUser ? (
              <>
                <span className="account-name">{currentUser.name}</span>
                <button className="account-button" onClick={onLogout} type="button">
                  Log out
                </button>
              </>
            ) : (
              <button
                className="account-button"
                disabled={authLoading}
                onClick={onLogin}
                type="button"
              >
                {authLoading ? 'Logging in...' : 'Log in'}
              </button>
            )}
          </div>
          {/* Category buttons switch between Popular, Trending, and Watchlist. */}
          <CategoryFilters
            categories={categories}
            category={category}
            disabled={Boolean(query.trim())}
            onCategoryChange={onCategoryChange}
          />
          {/* Search updates the query stored in App.jsx. */}
          <SearchBar query={query} onQueryChange={onQueryChange} />
        </div>
      </nav>

      <div className="hero-copy">
        {/* Shows the active category or search mode above the selected movie title. */}
        <p className="eyebrow">{query.trim() ? 'Search results' : categoryLabel}</p>
        <h2>{hero?.title ?? 'Movies are loading'}</h2>
        <div className="hero-actions">
          {/* Selects this hero movie and scrolls to the video player. */}
          <button
            className="primary-action"
            disabled={!hero?.id}
            onClick={() => hero?.id && onSelectHero(hero.id)}
            type="button"
          >
            View Details
          </button>
          {/* Adds or removes the hero movie from the saved watchlist. */}
          <button
            className="secondary-action"
            disabled={!hero?.id || disabledActions}
            onClick={() => onToggleWatchlist(hero)}
            type="button"
          >
            {!currentUser
              ? 'Log in to Save'
              : watchlisted
                ? 'Remove from Watchlist'
                : 'Add to Watchlist'}
          </button>
          <button
            className="secondary-action favorite-action"
            disabled={!hero?.id || disabledActions}
            onClick={() => onFavorite(hero)}
            type="button"
          >
            {!currentUser ? 'Log in to Favorite' : favorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
