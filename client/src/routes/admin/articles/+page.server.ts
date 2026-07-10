import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { deleteArticle, listArticles } from '$lib/api/articles.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals }) => {
  const result = await listArticles({ token: locals.token, limit: 100 });
  return { articles: result.items };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deleteArticle(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
