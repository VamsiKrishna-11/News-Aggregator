/**
 * API Service Client
 * Handles communication with the Express backend, automatically injects
 * JWT Bearer tokens from localStorage, and provides structured error handling.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 *
 * @param {string} endpoint - API path (e.g., '/news', '/bookmarks')
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Retrieve JWT from localStorage
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse JSON payload safely
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const error = new Error(
        data.message || (data.errors ? data.errors[0]?.message : `Request failed with status ${response.status}`)
      );
      error.status = response.status;
      error.data = data;
      error.errors = data.errors || [];
      throw error;
    }

    return data;
  } catch (error) {
    // Re-throw structured API error or network failure
    if (!error.status) {
      error.message = error.message || 'Unable to connect to the server. Please check your connection.';
      error.status = 0;
    }
    throw error;
  }
}

/**
 * HTTP helper methods
 */
export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

/**
 * News API service functions
 */
export const newsApi = {
  getNews: async ({ category = 'general', search = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search && search.trim()) params.set('search', search.trim());
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));

    const queryString = params.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    return await api.get(endpoint);
  },
};

/**
 * Bookmarks API service functions
 */
export const bookmarkApi = {
  getBookmarks: async ({ category, search } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search && search.trim()) params.set('search', search.trim());

    const queryString = params.toString();
    const endpoint = `/bookmarks${queryString ? `?${queryString}` : ''}`;
    return await api.get(endpoint);
  },

  saveBookmark: async (article) => {
    return await api.post('/bookmarks', {
      title: article.title,
      description: article.description || '',
      url: article.url,
      imageUrl: article.imageUrl || article.urlToImage || article.image || '',
      sourceName: article.sourceName || article.source?.name || 'Unknown Source',
      category: article.category || 'general',
      publishedAt: article.publishedAt || new Date().toISOString(),
    });
  },

  deleteBookmark: async (bookmarkId) => {
    return await api.delete(`/bookmarks/${bookmarkId}`);
  },

  checkBookmark: async (url) => {
    return await api.get(`/bookmarks/check?url=${encodeURIComponent(url)}`);
  },
};

/**
 * Auth API service functions
 */
export const authApi = {
  login: async ({ email, password }) => {
    return await api.post('/auth/login', { email, password });
  },

  register: async ({ username, email, password }) => {
    return await api.post('/auth/register', { username, email, password });
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },
};

export default api;
