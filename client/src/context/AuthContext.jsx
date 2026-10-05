import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session on app initialization if token exists
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response?.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      } catch (error) {
        console.warn('Session verification failed, clearing credentials:', error.message);
        if (isMounted) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  /**
   * Log in user with credentials
   */
  const login = useCallback(async ({ email, password }) => {
    const response = await authApi.login({ email, password });
    if (response?.token && response?.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async ({ username, email, password }) => {
    const response = await authApi.register({ username, email, password });
    if (response?.token && response?.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Log out user and wipe local credentials
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
