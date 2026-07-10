import { env } from '$env/dynamic/private';

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/** Base URL for server-to-server calls to the Express API (see lib/api/client.ts). */
export const API_BASE_URL = required('API_BASE_URL', env.API_BASE_URL);

/** Must match the Express API's JWT_SECRET — verified locally in hooks.server.ts. */
export const JWT_SECRET = required('JWT_SECRET', env.JWT_SECRET);

export const COOKIE_NAME = env.COOKIE_NAME ?? 'portfolio_token';
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN ?? '7d';
