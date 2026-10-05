import { useEffect } from 'react';

/**
 * Toast Notification Banner
 *
 * @param {Object} props
 * @param {{ id: string, message: string, type: 'success' | 'error' | 'info' } | null} props.notification
 * @param {Function} props.onClose
 */
export default function Notification({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { message, type = 'info' } = notification;

  return (
    <div className="notification-toast-container" aria-live="polite">
      <div className={`notification-toast ${type}`} role="alert">
        <span className="toast-icon">
          {type === 'success' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          {type === 'error' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          {type === 'info' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </span>
        <span className="toast-message">{message}</span>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
