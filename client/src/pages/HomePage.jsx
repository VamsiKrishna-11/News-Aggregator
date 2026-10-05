import { useState, useEffect, useCallback } from 'react';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ArticleGrid from '../components/ArticleGrid.jsx';
import { newsApi, bookmarkApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * HomePage View
 * Displays live news feed with categories, search bar, and bookmarking.
 *
 * @param {Object} props
 * @param {string} props.activeCategory - Active category
 * @param {Function} props.onSelectCategory - Category updater
 * @param {Set<string>} props.bookmarkedUrls - Set of URLs bookmarked by the user
 * @param {Function} props.onRefreshBookmarks - Callback to re-sync bookmarks
 * @param {Function} props.onOpenAuthModal - Opens auth modal if guest attempts bookmarking
 * @param {Function} props.showNotification - Toast trigger
 */
export default function HomePage({
  activeCategory = 'general',
  onSelectCategory,
  bookmarkedUrls = new Set(),
  onRefreshBookmarks,
  onOpenAuthModal,
  showNotification,
}) {
  const { isAuthenticated } = useAuth();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Fetch news articles from backend proxy
  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await newsApi.getNews({
        category: activeCategory,
        search: activeSearch,
        pageSize: 24,
      });

      if (response?.articles) {
        setArticles(response.articles);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
      setError(err.message || 'Unable to connect to the news service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeSearch]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
  };

  // Toggle bookmark for an article
  const handleBookmarkToggle = async (article) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to save articles to your bookmarks.', 'info');
      onOpenAuthModal('login');
      return;
    }

    const isAlreadyBookmarked = bookmarkedUrls.has(article.url);

    try {
      if (isAlreadyBookmarked) {
        // If we want to remove, check if we have the ID or query it
        const checkRes = await bookmarkApi.checkBookmark(article.url);
        if (checkRes?.bookmarkId) {
          await bookmarkApi.deleteBookmark(checkRes.bookmarkId);
          showNotification('Article removed from your bookmarks.', 'info');
          if (onRefreshBookmarks) onRefreshBookmarks();
        }
      } else {
        // Save bookmark
        await bookmarkApi.saveBookmark(article);
        showNotification('Article saved to your bookmarks!', 'success');
        if (onRefreshBookmarks) onRefreshBookmarks();
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
      showNotification(err.message || 'Failed to update bookmark.', 'error');
    }
  };

  return (
    <div>
      {/* Hero Header & Search Section (1D Flexbox) */}
      <section className="hero-section">
        <div className="hero-header">
          <h1 className="hero-title">
            The World&apos;s Headlines,{' '}
            <span
              style={{
                background: 'var(--gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Curated in Real Time.
            </span>
          </h1>
          <p className="hero-subtitle">
            Explore breaking stories, in-depth reports, and category feeds from hundreds of verified global news outlets.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="search-bar-container" role="search">
          <div className="search-input-wrapper">
            <svg
              className="search-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search news, topics, or sources (e.g. AI, Climate, Markets)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="news-search-input"
            />
            {searchInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginLeft: '0.75rem', height: '46px' }}
          >
            Search
          </button>
        </form>

        {/* Active Search Filter Badge */}
        {activeSearch && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Showing results for: <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{activeSearch}&rdquo;</strong>
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px' }}
              onClick={handleClearSearch}
            >
              Reset filter
            </button>
          </div>
        )}
      </section>

      {/* Category Pills Filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          if (activeSearch) handleClearSearch();
          onSelectCategory(cat);
        }}
      />

      {/* Main 2D Articles Grid */}
      <ArticleGrid
        articles={articles}
        isLoading={isLoading}
        error={error}
        onRetry={loadNews}
        bookmarkedUrls={bookmarkedUrls}
        onBookmarkToggle={handleBookmarkToggle}
        emptyTitle={activeSearch ? `No stories found for "${activeSearch}"` : 'No stories found in this category'}
        emptySubtitle="Try adjusting your search keywords or browsing another category."
      />
    </div>
  );
}
