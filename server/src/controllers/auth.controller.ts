import type { Request, Response } from 'express';
import type { AuthUser, LoginInput } from '@portfolio/shared';
import { User } from '../models/index.js';
import { comparePassword, signToken } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  user.lastLoginAt = new Date();
  await user.save();

  const authUser: AuthUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = signToken(authUser);

  sendSuccess(res, { user: authUser, token });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // JWTs are stateless — there is nothing to invalidate server-side. This
  // endpoint exists for API completeness and as the extension point for a
  // future token-revocation list. The client discards its own cookie.
  sendSuccess(res, { loggedOut: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, req.user);
});
