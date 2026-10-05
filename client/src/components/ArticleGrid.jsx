import ArticleCard from './ArticleCard.jsx';

/**
 * Skeleton Card for loading state
 */
function ArticleCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-box skeleton-media" />
      <div className="skeleton-content">
        <div className="skeleton-box skeleton-line" style={{ width: '35%', height: '12px' }} />
        <div className="skeleton-box skeleton-line" style={{ width: '90%', height: '22px', marginTop: '4px' }} />
        <div className="skeleton-box skeleton-line" style={{ width: '70%', height: '22px' }} />
        <div className="skeleton-box skeleton-line" style={{ width: '100%', height: '14px', marginTop: '12px' }} />
        <div className="skeleton-box skeleton-line" style={{ width: '85%', height: '14px' }} />
      </div>
    </div>
  );
}

/**
 * ArticleGrid Component
 *
 * @param {Object} props
 * @param {Array} props.articles - List of article objects
 * @param {boolean} [props.isLoading=false] - Whether data is loading
 * @param {string|null} [props.error=null] - Error message if fetch failed
 * @param {Function} [props.onRetry] - Retry callback on error
 * @param {Set|Array} [props.bookmarkedUrls] - Set or Array of URLs that are bookmarked
 * @param {Function} props.onBookmarkToggle - Handler for toggling bookmark
 * @param {boolean} [props.isBookmarkView=false] - Whether displayed in Bookmarks page
 * @param {Function} [props.onDeleteBookmark] - Handler for deleting from Bookmarks page
 * @param {string} [props.emptyTitle='No stories found'] - Title for empty state
 * @param {string} [props.emptySubtitle='Try searching for a different keyword or selecting another category.'] - Subtitle for empty state
 */
export default function ArticleGrid({
  articles = [],
  isLoading = false,
  error = null,
  onRetry,
  bookmarkedUrls = new Set(),
  onBookmarkToggle,
  isBookmarkView = false,
  onDeleteBookmark,
  emptyTitle = 'No stories found',
  emptySubtitle = 'Try searching for a different keyword or exploring another category.',
}) {
  // Loading State: Render 6 shimmer skeleton cards
  if (isLoading) {
    return (
      <div className="article-grid" aria-busy="true" aria-label="Loading articles">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ArticleCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // Error State: Render friendly error message with retry button
  if (error) {
    return (
      <div className="state-container" role="alert">
        <div className="state-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="state-title">Unable to load stories</h3>
        <p className="state-description">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty State: No articles returned
  if (!articles || articles.length === 0) {
    return (
      <div className="state-container">
        <div className="state-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="state-title">{emptyTitle}</h3>
        <p className="state-description">{emptySubtitle}</p>
      </div>
    );
  }

  // Success State: Render responsive CSS Grid
  const bookmarkedSet =
    bookmarkedUrls instanceof Set ? bookmarkedUrls : new Set(bookmarkedUrls || []);

  return (
    <div className="article-grid" role="feed" aria-label="News articles list">
      {articles.map((article, index) => {
        const isSaved = bookmarkedSet.has(article.url);

        return (
          <ArticleCard
            key={article._id || article.url || `article-${index}`}
            article={article}
            isBookmarked={isSaved}
            onBookmarkToggle={onBookmarkToggle}
            isBookmarkView={isBookmarkView}
            onDelete={onDeleteBookmark}
          />
        );
      })}
    </div>
  );
}
