import type { AuthUser } from '@portfolio/shared';

declare global {
  namespace Express {
    interface Request {
      /** Populated by `auth.middleware.ts` after JWT verification. */
      user?: AuthUser;
    }
  }
}

export {};
