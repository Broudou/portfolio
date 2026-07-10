import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';
import { listContactMessages } from '$lib/api/contact.js';

/**
 * Server-side auth guard for every /admin/** route. This runs before any
 * protected HTML or data reaches the client — there is no client-only
 * "hide the admin nav" fallback anywhere in this app.
 */
export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isLoginPage = url.pathname === '/admin/login';

  if (!locals.user && !isLoginPage) {
    throw redirect(303, `/admin/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }

  if (locals.user && isLoginPage) {
    throw redirect(303, '/admin');
  }

  if (!locals.user) {
    return { user: null, unreadMessagesCount: 0 };
  }

  const messages = await listContactMessages(locals.token!, { limit: 50 });
  const unreadMessagesCount = messages.items.filter((message) => !message.isRead).length;

  return { user: locals.user, unreadMessagesCount };
};
