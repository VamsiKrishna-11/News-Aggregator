import React from 'react';
import './BookmarksDrawer.css';

export default function BookmarksDrawer({ isOpen, onClose, bookmarks, onDeleteBookmark }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Saved Articles ({bookmarks.length})</h3>
          <button className="btn-bookmark" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-list">
          {bookmarks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No saved articles yet.</p>
          ) : (
            bookmarks.map((bm) => (
              <div key={bm._id} className="drawer-item">
                <h4>{bm.title}</h4>
                <div className="drawer-item-actions">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    Read →
                  </a>
                  <button
                    className="btn-delete"
                    onClick={() => onDeleteBookmark(bm._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}