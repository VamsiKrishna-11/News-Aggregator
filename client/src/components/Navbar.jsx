import { useAuth } from '../context/AuthContext.jsx';

/**
 * Navbar Component
 * Semantic <header> and <nav> using 1D Flexbox.
 *
 * @param {Object} props
 * @param {'feed' | 'bookmarks'} props.activeTab - Currently active page view
 * @param {Function} props.onSelectTab - Tab change handler
 * @param {number} [props.bookmarkCount=0] - Number of saved bookmarks
 * @param {Function} props.onOpenAuthModal - Opens Login/Signup modal
 */
export default function Navbar({
  activeTab = 'feed',
  onSelectTab,
  bookmarkCount = 0,
  onOpenAuthModal,
}) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Section */}
        <div
          className="brand-section"
          onClick={() => onSelectTab('feed')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('feed');
          }}
          aria-label="PulseNews Home"
        >
          <div className="brand-icon-wrapper">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="brand-logo">
            Pulse<span>News</span>
            <span className="brand-pulse-dot" title="Live headlines connected" />
          </span>
        </div>

        {/* View Navigation Links (1D Flexbox) */}
        <nav className="nav-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => onSelectTab('feed')}
            id="nav-tab-feed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            <span>Live Feed</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => {
              if (!isAuthenticated) {
                onOpenAuthModal('login');
              } else {
                onSelectTab('bookmarks');
              }
            }}
            id="nav-tab-bookmarks"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Saved Stories</span>
            {isAuthenticated && bookmarkCount > 0 && (
              <span className="badge-counter">{bookmarkCount}</span>
            )}
          </button>
        </nav>

        {/* User Auth Controls */}
        <div className="nav-auth-controls">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-badge" title={`Signed in as ${user?.email}`}>
                <div className="user-avatar-circle">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.username || 'User'}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={logout}
                id="btn-logout"
                title="Log out from your account"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onOpenAuthModal('login')}
              id="btn-signin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
