import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { deletePublication, listPublications } from '$lib/api/publications.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async () => {
  const publications = await listPublications();
  return { publications };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deletePublication(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
