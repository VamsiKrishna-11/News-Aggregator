import { newsService } from '../services/newsService.js';

/**
 * @desc    Get top headlines and categorized news articles (with optional search)
 * @route   GET /api/news
 * @access  Public
 * @params  Query params: category (string), search (string), page (number), pageSize (number)
 */
export const getNews = async (req, res, next) => {
  try {
    const { category = 'general', search = '', page = 1, pageSize = 20 } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedPageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));

    const result = await newsService.getArticles({
      category: String(category).trim().toLowerCase(),
      search: String(search).trim(),
      page: parsedPage,
      pageSize: parsedPageSize,
    });

    res.status(200).json({
      success: true,
      count: result.articles.length,
      total: result.total,
      category: String(category).trim().toLowerCase(),
      search: search ? String(search).trim() : null,
      page: parsedPage,
      articles: result.articles,
      ...(result.isMock && {
        isMock: true,
        notice: result.notice,
      }),
      ...(result.provider && { provider: result.provider }),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNews,
};
