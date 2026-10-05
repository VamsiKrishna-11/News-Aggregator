import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes with Zod validation middleware
router.post('/register', validate(registerSchema), registerUser);
router.post('/signup', validate(registerSchema), registerUser); // Semantic alias
router.post('/login', validate(loginSchema), loginUser);

// Protected routes (Requires Bearer JWT)
router.get('/me', protect, getMe);

export default router;
