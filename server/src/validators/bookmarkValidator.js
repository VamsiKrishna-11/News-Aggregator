import { z } from 'zod';

export const createBookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  url: z.string().url('A valid article URL is required'),
  urlToImage: z.string().optional().default(''),
  sourceName: z.string().optional().default('Unknown Source'),
  publishedAt: z.string().optional(),
  category: z.string().optional().default('general'),
});