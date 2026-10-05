import mongoose from 'mongoose';

/**
 * SavedArticle Schema
 * Stores articles bookmarked by users.
 * Enforces per-user uniqueness by URL using a compound index.
 */
const savedArticleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [1000, 'Title cannot exceed 1000 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Article URL is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sourceName: {
      type: String,
      default: 'Unknown Source',
      trim: true,
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
      lowercase: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'savedarticles',
  }
);

// Compound unique index to prevent duplicate bookmarks for the same article per user
savedArticleSchema.index({ userId: 1, url: 1 }, { unique: true });

export const SavedArticle = mongoose.model('SavedArticle', savedArticleSchema);
export default SavedArticle;
