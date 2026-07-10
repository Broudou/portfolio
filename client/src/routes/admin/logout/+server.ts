import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { COOKIE_NAME } from '$lib/server/config.js';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, { path: '/' });
  throw redirect(303, '/admin/login');
};
