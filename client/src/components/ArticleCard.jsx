import { useState } from 'react';

/**
 * Format date string into human-friendly relative or calendar time
 */
function formatPublicationTime(dateString) {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recent';

    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recent';
  }
}

// Fallback high quality news placeholder images based on category
const FALLBACK_IMAGES = {
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  business: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  science: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  general: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
};

/**
 * ArticleCard Component
 *
 * @param {Object} props
 * @param {Object} props.article - Article data
 * @param {boolean} [props.isBookmarked=false] - Whether article is bookmarked
 * @param {Function} props.onBookmarkToggle - Handler for bookmarking/unbookmarking
 * @param {boolean} [props.isBookmarkView=false] - Whether card is shown in Bookmarks page
 * @param {Function} [props.onDelete] - Delete handler for saved article view
 */
export default function ArticleCard({
  article,
  isBookmarked = false,
  onBookmarkToggle,
  isBookmarkView = false,
  onDelete,
}) {
  const {
    _id,
    title,
    description,
    url,
    imageUrl,
    sourceName,
    category = 'general',
    publishedAt,
  } = article;

  const defaultCategoryImg =
    FALLBACK_IMAGES[category?.toLowerCase()] || FALLBACK_IMAGES.general;

  const [imgSrc, setImgSrc] = useState(imageUrl || defaultCategoryImg);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(defaultCategoryImg);
    }
  };

  return (
    <article className="article-card" id={`article-${_id || encodeURIComponent(url)}`}>
      <div className="card-media">
        <img
          src={imgSrc}
          alt={title || 'News cover thumbnail'}
          className="card-image"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="card-badge-container">
          <span className="badge-source">{sourceName || 'News'}</span>
          {category && <span className="badge-category">{category}</span>}
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <time dateTime={publishedAt}>{formatPublicationTime(publishedAt)}</time>
        </div>

        <h3 className="card-title">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
          >
            {title}
          </a>
        </h3>

        {description && <p className="card-description">{description}</p>}
      </div>

      <footer className="card-footer">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="read-more-link"
        >
          Read story
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>

        {isBookmarkView ? (
          <button
            type="button"
            className="btn btn-danger btn-icon"
            onClick={() => onDelete && onDelete(_id || article)}
            title="Remove from saved articles"
            aria-label="Remove bookmark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className={`bookmark-btn ${isBookmarked ? 'saved' : ''}`}
            onClick={() => onBookmarkToggle && onBookmarkToggle(article)}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save article'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </footer>
    </article>
  );
}
