/**
 * News Service
 * Handles fetching, filtering, and normalizing news articles from external providers
 * (e.g. NewsAPI or GNews) using modern native fetch with structured error handling.
 */

// Supported external providers
const PROVIDER_NEWSAPI = 'newsapi';
const PROVIDER_GNEWS = 'gnews';

// Curated realistic mock articles for demo/development when NEWS_API_KEY is not configured
const MOCK_ARTICLES = [
  {
    title: 'Breakthrough in Quantum Computing: Quantum Advantage Achieved at Room Temperature',
    description: 'Researchers announce a historic milestone in quantum coherence, demonstrating stable qubit operations without cryogenic cooling systems.',
    url: 'https://example.com/news/quantum-computing-breakthrough-2026',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Tech Chronicle',
    category: 'technology',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    content: 'A research consortium led by international physicists has unveiled a scalable room-temperature quantum processor...',
  },
  {
    title: 'Global Tech Giants Unveil Unified Open Standards for Next-Generation Edge AI',
    description: 'Industry leaders agree on unified protocols enabling localized privacy-preserving inference across billions of consumer smart devices.',
    url: 'https://example.com/news/edge-ai-open-standards-2026',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Silicon Herald',
    category: 'technology',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    content: 'In a joint summit, major semiconductor designers and cloud infrastructure providers established an open-source standard...',
  },
  {
    title: 'Global Renewable Energy Investments Surge Past Record Highs in Q1',
    description: 'Investments in offshore wind, solar energy, and grid-scale storage outpaced traditional fossil fuel capital expenditures by 30%.',
    url: 'https://example.com/news/renewable-energy-record-investments',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Global Financial Daily',
    category: 'business',
    publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    content: 'Global financial institutions poured unprecedented capital into renewable infrastructure projects throughout the first quarter...',
  },
  {
    title: 'Central Banks Announce Synchronized Monetary Policy Framework for Digital Currencies',
    description: 'International regulatory bodies release guidelines to safeguard cross-border settlement systems while mitigating systemic risks.',
    url: 'https://example.com/news/central-banks-digital-currency-framework',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Market Watch Journal',
    category: 'business',
    publishedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    content: 'The committee on payment settlement systems finalized its multilateral recommendations for sovereign digital currencies...',
  },
  {
    title: 'James Webb Space Telescope Discovers Atmospheric Water Vapor on Nearby Exoplanet',
    description: 'Astronomers detect clear spectroscopic signatures of water vapor and methane in the habitable zone of an M-dwarf stellar system.',
    url: 'https://example.com/news/jwst-exoplanet-water-vapor',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Astrophysics Today',
    category: 'science',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    content: 'Spectral data gathered by the deep-space observatory confirms chemical compounds consistent with prebiotic atmospheric models...',
  },
  {
    title: 'Clinical Trials Show Promising Results for Universal mRNA-Based Flu Vaccine',
    description: 'Phase III clinical data indicates broad, durable antibody response across all known influenza A and B seasonal strains.',
    url: 'https://example.com/news/universal-mrna-flu-vaccine-trials',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Medical Horizons',
    category: 'health',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    content: 'The groundbreaking trial enrolled over 12,000 participants worldwide and showcased multi-year neutralization titers...',
  },
  {
    title: 'International Film Festival Celebrates Indie Cinema Revolution with Virtual Screenings',
    description: 'Groundbreaking independent cinematic projects filmed using hyper-realistic virtual production stages capture top honors.',
    url: 'https://example.com/news/film-festival-indie-cinema-awards',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Entertainment Pulse',
    category: 'entertainment',
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    content: 'The jury awarded the Grand Prize to a visually stunning independent drama produced entirely with open-source rendering software...',
  },
  {
    title: 'Championship Finals Showcase Thrilling Overtime Victory in Historic Decider',
    description: 'A breathtaking buzzer-beater in double overtime seals one of the most dramatic finishes in modern athletic tournament history.',
    url: 'https://example.com/news/championship-finals-dramatic-overtime-finish',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    sourceName: 'Sports Arena Daily',
    category: 'sports',
    publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    content: 'Fans witnessed an extraordinary battle of endurance and precision as the underdogs rallied from a 14-point deficit...',
  },
  {
    title: 'Global Summit on AI Safety Concludes with Binding Commitments from 40 Nations',
    description: 'World leaders and leading AI research laboratories sign landmark agreement guaranteeing transparent safety testing for frontier models.',
    url: 'https://example.com/news/ai-safety-summit-declaration',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    sourceName: 'World Affairs Dispatch',
    category: 'general',
    publishedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    content: 'Representatives from forty nations concluded negotiations on an international oversight framework for autonomous algorithmic agents...',
  },
];

/**
 * Normalizes articles from NewsAPI format to standard application schema
 */
const normalizeNewsApiArticles = (rawArticles = [], defaultCategory = 'general') => {
  return rawArticles
    .filter((item) => item && item.title && item.title !== '[Removed]' && item.url)
    .map((item, index) => ({
      id: item.url || `newsapi-${index}`,
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      url: item.url,
      imageUrl: item.urlToImage || '',
      sourceName: item.source?.name || 'Unknown Source',
      category: defaultCategory,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
    }));
};

/**
 * Normalizes articles from GNews format to standard application schema
 */
const normalizeGNewsArticles = (rawArticles = [], defaultCategory = 'general') => {
  return rawArticles
    .filter((item) => item && item.title && item.url)
    .map((item, index) => ({
      id: item.url || `gnews-${index}`,
      title: item.title,
      description: item.description || '',
      content: item.content || '',
      url: item.url,
      imageUrl: item.image || '',
      sourceName: item.source?.name || 'Unknown Source',
      category: defaultCategory,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
    }));
};

/**
 * Fetches news from NewsAPI (https://newsapi.org)
 */
const fetchFromNewsApi = async (apiKey, { category, search, page = 1, pageSize = 20 }) => {
  const url = new URL(
    search ? 'https://newsapi.org/v2/everything' : 'https://newsapi.org/v2/top-headlines'
  );

  if (search) {
    url.searchParams.set('q', search);
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('language', 'en');
  } else {
    // top-headlines supports country and category
    url.searchParams.set('country', 'us');
    if (category && category !== 'all' && category !== 'general') {
      url.searchParams.set('category', category.toLowerCase());
    }
  }

  url.searchParams.set('page', String(page));
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('apiKey', apiKey);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NewsAggregatorApp/1.0',
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      const errorMsg = data.message || `NewsAPI returned HTTP status ${response.status}`;
      const err = new Error(errorMsg);
      err.statusCode = response.status === 401 ? 401 : response.status === 429 ? 429 : 502;
      throw err;
    }

    const normalized = normalizeNewsApiArticles(data.articles, category || 'general');
    return {
      total: data.totalResults || normalized.length,
      articles: normalized,
      provider: PROVIDER_NEWSAPI,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const err = new Error('News provider request timed out. Please try again.');
      err.statusCode = 504;
      throw err;
    }
    throw error;
  }
};

/**
 * Fetches news from GNews (https://gnews.io)
 */
const fetchFromGNews = async (apiKey, { category, search, page = 1, pageSize = 20 }) => {
  const url = new URL(
    search ? 'https://gnews.io/api/v4/search' : 'https://gnews.io/api/v4/top-headlines'
  );

  if (search) {
    url.searchParams.set('q', search);
  } else if (category && category !== 'all') {
    url.searchParams.set('category', category.toLowerCase());
  }

  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', String(pageSize));
  url.searchParams.set('page', String(page));
  url.searchParams.set('apikey', apiKey);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || data.errors) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(', ')
        : data.message || `GNews returned HTTP status ${response.status}`;
      const err = new Error(errorMsg);
      err.statusCode = response.status === 401 ? 401 : response.status === 429 ? 429 : 502;
      throw err;
    }

    const normalized = normalizeGNewsArticles(data.articles, category || 'general');
    return {
      total: data.totalArticles || normalized.length,
      articles: normalized,
      provider: PROVIDER_GNEWS,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const err = new Error('News provider request timed out. Please try again.');
      err.statusCode = 504;
      throw err;
    }
    throw error;
  }
};

/**
 * Filter mock articles based on category and search query for demo/development mode
 */
const filterMockArticles = ({ category, search }) => {
  let results = [...MOCK_ARTICLES];

  if (category && category.toLowerCase() !== 'all') {
    const cat = category.toLowerCase();
    results = results.filter((item) => item.category.toLowerCase() === cat);
    // If no exact category match in mock dataset, keep all to provide data
    if (results.length === 0) {
      results = MOCK_ARTICLES.map((item) => ({ ...item, category: cat }));
    }
  }

  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }

  return results;
};

/**
 * Main service method to retrieve news articles.
 *
 * @param {Object} options
 * @param {string} [options.category='general'] - News category (e.g. business, technology, sports)
 * @param {string} [options.search] - Search keywords
 * @param {number} [options.page=1] - Page number for pagination
 * @param {number} [options.pageSize=20] - Number of articles per page
 * @returns {Promise<{ articles: Array, total: number, isMock?: boolean, notice?: string }>}
 */
export const getArticles = async ({ category = 'general', search = '', page = 1, pageSize = 20 } = {}) => {
  const apiKey = process.env.NEWS_API_KEY?.trim();
  const provider = (process.env.NEWS_PROVIDER || PROVIDER_NEWSAPI).toLowerCase();

  // If no external API key is provided, return structured demo mock articles
  if (!apiKey || apiKey === 'your_news_api_key_here') {
    console.warn(
      `[NewsService] NEWS_API_KEY not configured in environment. Serving curated fallback articles for category "${category}".`
    );
    const mockData = filterMockArticles({ category, search });
    return {
      total: mockData.length,
      articles: mockData,
      isMock: true,
      notice: 'Running in demo mode. Add a valid NEWS_API_KEY to server/.env to stream live news articles.',
    };
  }

  // Delegate to configured provider
  if (provider === PROVIDER_GNEWS) {
    return await fetchFromGNews(apiKey, { category, search, page, pageSize });
  }

  // Default provider: NewsAPI
  return await fetchFromNewsApi(apiKey, { category, search, page, pageSize });
};

export const newsService = {
  getArticles,
};

export default newsService;
