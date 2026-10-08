import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    urlToImage: {
      type: String,
      default: '',
    },
    sourceName: {
      type: String,
      default: 'Unknown Source',
    },
    publishedAt: {
      type: Date,
    },
    category: {
      type: String,
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent saving identical article links twice for the same user
bookmarkSchema.index({ user: 1, url: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);