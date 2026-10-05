import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Modal from './components/Modal.jsx';
import Notification from './components/Notification.jsx';
import LoginForm from './components/forms/LoginForm.jsx';
import SignupForm from './components/forms/SignupForm.jsx';
import HomePage from './pages/HomePage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import { bookmarkApi } from './services/api.js';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Navigation and active feed view
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'bookmarks'
  const [activeCategory, setActiveCategory] = useState('general');

  // Bookmarks state (for authenticated users)
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Toast notification state
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ id: Date.now(), message, type });
  }, []);

  // Fetch bookmarks from backend
  const loadUserBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }

    try {
      setIsBookmarksLoading(true);
      const res = await bookmarkApi.getBookmarks();
      if (res?.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch bookmarks:', err.message);
    } finally {
      setIsBookmarksLoading(false);
    }
  }, [isAuthenticated]);

  // Synchronize bookmarks whenever user logs in or out
  useEffect(() => {
    loadUserBookmarks();
  }, [loadUserBookmarks]);

  // Create an efficient Set of bookmarked URLs for quick lookups
  const bookmarkedUrls = useMemo(() => {
    return new Set(bookmarks.map((b) => b.url).filter(Boolean));
  }, [bookmarks]);

  // Open authentication modal
  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = (msg) => {
    handleCloseAuthModal();
    showNotification(msg, 'success');
    loadUserBookmarks();
  };

  // If user logs out while on bookmarks tab, fallback to feed
  useEffect(() => {
    if (!isAuthenticated && activeTab === 'bookmarks') {
      setActiveTab('feed');
    }
  }, [isAuthenticated, activeTab]);

  return (
    <div className="app-container">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        bookmarkCount={bookmarks.length}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'feed' ? (
          <HomePage
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            bookmarkedUrls={bookmarkedUrls}
            onRefreshBookmarks={loadUserBookmarks}
            onOpenAuthModal={handleOpenAuthModal}
            showNotification={showNotification}
          />
        ) : (
          <BookmarksPage
            bookmarks={bookmarks}
            isLoading={isBookmarksLoading}
            onRefresh={loadUserBookmarks}
            onGoToFeed={() => setActiveTab('feed')}
            showNotification={showNotification}
          />
        )}
      </main>

      {/* Semantic Footer */}
      <Footer onSelectCategory={(cat) => {
        setActiveCategory(cat);
        setActiveTab('feed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Accessible Auth Dialog Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        title={authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
      >
        {authModalMode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setAuthModalMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthModalMode('login')}
          />
        )}
      </Modal>

      {/* Interactive Toast Notifications */}
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
