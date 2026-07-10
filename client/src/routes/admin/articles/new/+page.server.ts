import { fail, redirect } from '@sveltejs/kit';
import { createArticleSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { createArticle } from '$lib/api/articles.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';
import { listMedia } from '$lib/api/media.js';
import { parseArticleForm } from '$lib/server/parseArticleForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals }) => {
  const [categories, tags, mediaResult] = await Promise.all([
    listCategories(),
    listTags(),
    listMedia(locals.token!, { limit: 100 }),
  ]);
  return { categories, tags, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createArticleSchema.safeParse(parseArticleForm(formData));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await createArticle(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/articles');
  },
};
