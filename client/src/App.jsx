import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import ArticleCard from './components/ArticleCard';
import AuthModal from './components/AuthModal';
import BookmarksDrawer from './components/BookmarksDrawer';

export default function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth & Bookmark states
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch News Feed
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE}/api/news?category=${category}`;
        if (searchTerm.trim() !== '') {
          url += `&q=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchNews(), 400);
    return () => clearTimeout(timeoutId);
  }, [category, searchTerm]);

  // Fetch Bookmarks when user is authenticated
  const fetchBookmarks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  };

  useEffect(() => {
    if (token) fetchBookmarks();
  }, [token]);

  const handleAuthSuccess = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setBookmarks([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleBookmark = async (article) => {
    if (!token) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          sourceName: article.sourceName,
          category: article.category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to save');
      } else {
        fetchBookmarks();
        alert('Article saved to your bookmarks!');
      }
    } catch (err) {
      alert('Error saving bookmark');
    }
  };

  const handleDeleteBookmark = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <CategoryFilter
          selectedCategory={category}
          onSelectCategory={setCategory}
        />

        {loading && <p style={{ color: 'var(--text-secondary)' }}>Fetching latest headlines...</p>}
        {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

        <div className="news-grid">
          {articles.map((item, index) => (
            <ArticleCard
              key={`${item.url}-${index}`}
              article={item}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <BookmarksDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
      />

      <footer>
        <p>&copy; {new Date().getFullYear()} News Aggregator. Built with React & Vite.</p>
      </footer>
    </div>
  );
}