/**
 * Category Filter Bar
 * Displays horizontal pill buttons allowing the user to filter news categories.
 *
 * @param {Object} props
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.onSelectCategory - Callback when a category is clicked
 */
const CATEGORIES = [
  { id: 'general', label: 'Top Stories', icon: '⚡' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'business', label: 'Business & Finance', icon: '📈' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'health', label: 'Health', icon: '🧬' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

export default function CategoryFilter({ activeCategory = 'general', onSelectCategory }) {
  return (
    <nav className="category-filter-wrapper" aria-label="News Categories">
      <ul className="category-filter-list" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = (activeCategory || 'general').toLowerCase() === cat.id;

          return (
            <li key={cat.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                id={`category-tab-${cat.id}`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
