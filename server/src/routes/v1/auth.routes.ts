import { Router } from 'express';
import { loginSchema } from '@portfolio/shared';
import { login, logout, me } from '../../controllers/auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { loginRateLimiter } from '../../middleware/rateLimit.middleware.js';

export const authRouter = Router();

authRouter.post('/login', loginRateLimiter, validate(loginSchema), login);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, me);
