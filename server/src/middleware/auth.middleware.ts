import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@portfolio/shared';
import { verifyToken } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Requires a valid `Authorization: Bearer <jwt>` header. The browser never
 * calls this API directly (see architecture notes in README) — SvelteKit's
 * server-side code reads the JWT from its own httpOnly cookie and forwards
 * it here as a Bearer token.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    next(ApiError.unauthorized());
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired session'));
  }
}

/**
 * Like `requireAuth`, but never rejects the request. If a valid Bearer token
 * is present, `req.user` is populated (so controllers can branch on it to
 * show drafts to admins); otherwise the request proceeds anonymously. Used
 * on public read routes whose controller itself decides what an anonymous
 * caller may see (e.g. published-only filtering).
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // Invalid/expired token on an optionally-authenticated route — treat as anonymous.
    }
  }

  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}
