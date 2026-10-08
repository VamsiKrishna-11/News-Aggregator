import express from 'express';
import { Bookmark } from '../models/Bookmark.js';
import { protect } from '../middleware/authMiddleware.js';
import { createBookmarkSchema } from '../validators/bookmarkValidator.js';

const router = express.Router();

// Apply auth protection to all bookmark routes
router.use(protect);

// GET /api/bookmarks - Fetch all saved bookmarks for the current user
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookmarks' });
  }
});

// POST /api/bookmarks - Save an article
router.post('/', async (req, res) => {
  try {
    const parsedData = createBookmarkSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsedData.error.flatten().fieldErrors,
      });
    }

    const { title, description, url, urlToImage, sourceName, publishedAt, category } = parsedData.data;

    // Check if the user already saved this URL
    const existing = await Bookmark.findOne({ user: req.user.id, url });
    if (existing) {
      return res.status(409).json({ error: 'Article is already bookmarked' });
    }

    const newBookmark = await Bookmark.create({
      user: req.user.id,
      title,
      description,
      url,
      urlToImage,
      sourceName,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      category,
    });

    res.status(201).json({ message: 'Article bookmarked successfully', bookmark: newBookmark });
  } catch (error) {
    console.error('Bookmark error:', error.message);
    res.status(500).json({ error: 'Internal server error while saving bookmark' });
  }
});

// DELETE /api/bookmarks/:id - Remove a saved article
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
    }

    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

export default router;