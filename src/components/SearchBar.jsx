// SearchBar component.
// It lets the user type a movie title and sends that text back to App.jsx.
// Search input used to find movies by title.
function SearchBar({ query, onQueryChange }) {
  return (
    <form className="search" onSubmit={(event) => event.preventDefault()}>
      <span aria-hidden="true">⌕</span>
      <input
        aria-label="Search movies"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search movies"
        type="search"
        value={query}
      />
    </form>
  )
}

export default SearchBar
