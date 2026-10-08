import express from 'express';

const router = express.Router();

// GET /api/news?category=technology&q=query
router.get('/', async (req, res) => {
  try {
    const { category = 'technology', q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'NEWS_API_KEY is missing in server environment.' });
    }

    // NewsAPI endpoint
    let targetUrl = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`;

    if (q && q.trim() !== '') {
      targetUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&apiKey=${apiKey}`;
    }

    const response = await fetch(targetUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Failed to fetch news from NewsAPI'
      });
    }

    // Normalize data structure
    const normalizedArticles = (data.articles || []).map((item) => ({
      title: item.title,
      description: item.description || '',
      url: item.url,
      urlToImage: item.urlToImage || '',
      sourceName: item.source?.name || 'Unknown',
      publishedAt: item.publishedAt,
      category: category,
    }));

    res.status(200).json({
      totalArticles: normalizedArticles.length,
      articles: normalizedArticles,
    });
  } catch (error) {
    console.error('Error in /api/news:', error.message);
    res.status(500).json({ error: 'Internal server error while fetching news' });
  }
});

export default router;