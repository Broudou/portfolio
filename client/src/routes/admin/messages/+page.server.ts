import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { deleteContactMessage, listContactMessages, markContactMessageRead } from '$lib/api/contact.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const result = await listContactMessages(locals.token!, { page, limit: 20 });
  return { messages: result.items, meta: result.meta };
};

export const actions: Actions = {
  toggleRead: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    const isRead = formData.get('isRead') === 'true';
    try {
      await markContactMessageRead(locals.token!, id, isRead);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { updated: true };
  },

  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deleteContactMessage(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
