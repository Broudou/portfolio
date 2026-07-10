import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { login } from '$lib/api/auth.js';
import { ApiClientError } from '$lib/api/client.js';
import { COOKIE_NAME, JWT_EXPIRES_IN } from '$lib/server/config.js';
import { parseDurationMs } from '$lib/server/duration.js';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ url }) => {
  return { redirectTo: url.searchParams.get('redirectTo') ?? '/admin' };
};

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const formData = await request.formData();
    const raw = { email: formData.get('email'), password: formData.get('password') };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { email: raw.email, errors: parsed.error.flatten().fieldErrors });
    }

    try {
      const { token } = await login(parsed.data);

      cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
        maxAge: parseDurationMs(JWT_EXPIRES_IN) / 1000,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(err.status === 401 ? 401 : 500, { email: raw.email, message: err.message });
      }
      throw err;
    }

    const redirectTo = url.searchParams.get('redirectTo') || '/admin';
    throw redirect(303, redirectTo);
  },
};
