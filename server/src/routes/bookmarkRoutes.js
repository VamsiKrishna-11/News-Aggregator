import express from 'express';
import {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
  checkBookmarkStatus,
} from '../controllers/bookmarkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createBookmarkSchema } from '../validators/bookmarkValidator.js';

const router = express.Router();

// All bookmark routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/bookmarks/check?url=...
 * @desc    Check if a specific article URL is bookmarked by the user
 * @access  Private
 */
router.get('/check', checkBookmarkStatus);

/**
 * @route   POST /api/bookmarks
 * @desc    Save an article bookmark for the logged-in user
 * @access  Private
 */
router.post('/', validate(createBookmarkSchema), saveBookmark);

/**
 * @route   GET /api/bookmarks
 * @desc    Retrieve all saved article bookmarks for the logged-in user
 * @access  Private
 */
router.get('/', getBookmarks);

/**
 * @route   DELETE /api/bookmarks/:id
 * @desc    Delete a saved article bookmark owned by the user
 * @access  Private
 */
router.delete('/:id', deleteBookmark);

export default router;
