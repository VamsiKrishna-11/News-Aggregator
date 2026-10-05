import express from 'express';
import { getNews } from '../controllers/newsController.js';

const router = express.Router();

/**
 * @route   GET /api/news
 * @desc    Fetch news headlines by category or search term
 * @access  Public
 */
router.get('/', getNews);

export default router;
