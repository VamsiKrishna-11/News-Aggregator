import { z } from 'zod';

/**
 * Zod validation schema for bookmark creation (POST /api/bookmarks)
 */
export const createBookmarkSchema = z.object({
  title: z
    .string({ required_error: 'Article title is required' })
    .trim()
    .min(1, 'Article title cannot be empty')
    .max(1000, 'Article title cannot exceed 1000 characters'),
  url: z
    .string({ required_error: 'Article URL is required' })
    .trim()
    .url('Please provide a valid article URL'),
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => val ?? ''),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => val ?? ''),
  sourceName: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : 'Unknown Source')),
  category: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.trim().length > 0 ? val.toLowerCase().trim() : 'general')),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return new Date();
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }),
});

// Semantic aliases
export const bookmarkSchema = createBookmarkSchema;
export const saveBookmarkSchema = createBookmarkSchema;
export default createBookmarkSchema;
