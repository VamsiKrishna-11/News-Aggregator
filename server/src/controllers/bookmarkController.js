import mongoose from 'mongoose';
import { SavedArticle } from '../models/SavedArticle.js';

/**
 * @desc    Save an article to the user's bookmarks
 * @route   POST /api/bookmarks
 * @access  Private (Requires JWT)
 */
export const saveBookmark = async (req, res, next) => {
  try {
    const { title, description, url, imageUrl, sourceName, category, publishedAt } = req.body;
    const userId = req.user._id;

    // Check if the article is already bookmarked by the user
    const existingBookmark = await SavedArticle.findOne({ userId, url });
    if (existingBookmark) {
      return res.status(409).json({
        success: false,
        message: 'This article is already in your saved bookmarks.',
        data: existingBookmark,
      });
    }

    // Create new saved article
    const bookmark = await SavedArticle.create({
      userId,
      title,
      description: description || '',
      url,
      imageUrl: imageUrl || '',
      sourceName: sourceName || 'Unknown Source',
      category: category ? category.toLowerCase() : 'general',
      publishedAt: publishedAt || new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Article saved to bookmarks successfully',
      data: bookmark,
    });
  } catch (error) {
    // Handle compound index collision race condition
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This article is already in your saved bookmarks.',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all saved articles for the authenticated user
 * @route   GET /api/bookmarks
 * @access  Private (Requires JWT)
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { category, search } = req.query;

    const query = { userId };

    if (category && category !== 'all') {
      query.category = category.toLowerCase().trim();
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { sourceName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const bookmarks = await SavedArticle.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a saved article from user's bookmarks
 * @route   DELETE /api/bookmarks/:id
 * @access  Private (Requires JWT)
 */
export const deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookmark ID format',
      });
    }

    const bookmark = await SavedArticle.findOne({ _id: id, userId });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found or you are not authorized to delete it.',
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check whether a specific article URL is already bookmarked by the user
 * @route   GET /api/bookmarks/check
 * @access  Private (Requires JWT)
 */
export const checkBookmarkStatus = async (req, res, next) => {
  try {
    const { url } = req.query;
    const userId = req.user._id;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL query parameter is required',
      });
    }

    const bookmark = await SavedArticle.findOne({ userId, url: String(url).trim() });

    res.status(200).json({
      success: true,
      isBookmarked: Boolean(bookmark),
      bookmarkId: bookmark ? bookmark._id : null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
  checkBookmarkStatus,
};
