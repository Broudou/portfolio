import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '@portfolio/shared';
import { COOKIE_NAME, JWT_SECRET } from '$lib/server/config.js';

/**
 * Verifies the auth cookie's JWT locally (JWT_SECRET is shared with the
 * Express API — see README "Architecture"). This never calls Express: it's
 * a pure signature/expiry check that populates `event.locals` for every
 * request, so route guards (e.g. admin/+layout.server.ts) can redirect
 * before any protected HTML or data ever reaches the client.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_NAME);

  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET) as AuthUser;
      event.locals.user = user;
      event.locals.token = token;
    } catch {
      event.locals.user = null;
      event.locals.token = null;
    }
  } else {
    event.locals.user = null;
    event.locals.token = null;
  }

  return resolve(event);
};
