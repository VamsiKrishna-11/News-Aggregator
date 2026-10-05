/**
 * Footer Component
 * Semantic <footer> using 1D Flexbox.
 *
 * @param {Object} props
 * @param {Function} props.onSelectCategory - Category selection shortcut
 */
export default function Footer({ onSelectCategory }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>PulseNews</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>v1.0.0</span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Real-time global news aggregation with custom category feeds and cloud bookmarks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 'var(--font-size-xs)', padding: '0.25rem 0.5rem' }}
            onClick={() => onSelectCategory && onSelectCategory('technology')}
          >
            Technology
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 'var(--font-size-xs)', padding: '0.25rem 0.5rem' }}
            onClick={() => onSelectCategory && onSelectCategory('business')}
          >
            Business
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 'var(--font-size-xs)', padding: '0.25rem 0.5rem' }}
            onClick={() => onSelectCategory && onSelectCategory('science')}
          >
            Science
          </button>
        </div>

        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          © {currentYear} PulseNews. Designed for modern web discovery.
        </div>
      </div>
    </footer>
  );
}
