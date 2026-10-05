import { z } from 'zod';

/**
 * Zod validation schema for user registration (/api/auth/register)
 */
export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password cannot exceed 100 characters'),
});

/**
 * Zod validation schema for user login (/api/auth/login)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});
