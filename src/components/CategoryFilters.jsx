// CategoryFilters component.
// It displays the Popular, Trending, and Watchlist buttons and reports clicks to App.jsx.
// Renders the category buttons in the top navigation.
function CategoryFilters({ categories, category, disabled, onCategoryChange }) {
  return (
    <div className="filters" aria-label="Movie categories">
      {categories.map((item) => (
        <button
          // Highlights the currently selected category when search is not active.
          className={category === item.id && !disabled ? 'is-selected' : ''}
          disabled={disabled}
          key={item.id}
          onClick={() => onCategoryChange(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilters
