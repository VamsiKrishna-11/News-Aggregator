import { useState } from 'react';
import ArticleGrid from '../components/ArticleGrid.jsx';
import { bookmarkApi } from '../services/api.js';

/**
 * BookmarksPage View
 * Displays saved articles belonging to the authenticated user.
 *
 * @param {Object} props
 * @param {Array} props.bookmarks - List of bookmarked article documents
 * @param {boolean} props.isLoading - Whether bookmarks are loading
 * @param {Function} props.onRefresh - Re-fetch bookmarks
 * @param {Function} props.onGoToFeed - Switch back to live news feed
 * @param {Function} props.showNotification - Toast trigger
 */
export default function BookmarksPage({
  bookmarks = [],
  isLoading = false,
  onRefresh,
  onGoToFeed,
  showNotification,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter bookmarks client-side for instant snappy response
  const filteredBookmarks = bookmarks.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (article.category && article.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      !searchTerm.trim() ||
      article.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      article.sourceName?.toLowerCase().includes(searchTerm.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  // Extract unique categories present in user's bookmarks
  const availableCategories = Array.from(
    new Set(bookmarks.map((b) => b.category?.toLowerCase()).filter(Boolean))
  );

  const handleDeleteBookmark = async (articleId) => {
    try {
      await bookmarkApi.deleteBookmark(articleId);
      showNotification('Bookmark removed.', 'info');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
      showNotification(err.message || 'Failed to remove bookmark.', 'error');
    }
  };

  return (
    <div>
      <section className="hero-section" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="hero-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="hero-title">Saved Articles</h1>
            <span className="badge-counter" style={{ fontSize: 'var(--font-size-sm)', height: '24px', padding: '0 8px' }}>
              {bookmarks.length}
            </span>
          </div>
          <p className="hero-subtitle">
            Your personal collection of reading material, accessible whenever you want to revisit them.
          </p>
        </div>

        {/* Filter & Search Bar within Bookmarks */}
        {bookmarks.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }} className="search-input-wrapper">
              <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search saved bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2rem' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear bookmark search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {availableCategories.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                  style={{ padding: '0.4rem 0.85rem' }}
                >
                  All ({bookmarks.length})
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ padding: '0.4rem 0.85rem', textTransform: 'capitalize' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Bookmarks Grid or Empty State */}
      {bookmarks.length === 0 && !isLoading ? (
        <div className="state-container">
          <div className="state-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="state-title">No bookmarks saved yet</h3>
          <p className="state-description">
            Whenever you come across an intriguing headline, click the bookmark icon to save it here for later.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGoToFeed}
            style={{ marginTop: '0.5rem' }}
          >
            Explore Today&apos;s News
          </button>
        </div>
      ) : (
        <ArticleGrid
          articles={filteredBookmarks}
          isLoading={isLoading}
          isBookmarkView={true}
          onDeleteBookmark={handleDeleteBookmark}
          emptyTitle="No matching saved bookmarks"
          emptySubtitle="No articles match your current search or category filter in your saved list."
        />
      )}
    </div>
  );
}
