import { error, fail, redirect } from '@sveltejs/kit';
import { updateArticleSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { listArticles, updateArticle } from '$lib/api/articles.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';
import { listMedia } from '$lib/api/media.js';
import { parseArticleForm } from '$lib/server/parseArticleForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [articlesResult, categories, tags, mediaResult] = await Promise.all([
    listArticles({ token: locals.token, limit: 100 }),
    listCategories(),
    listTags(),
    listMedia(locals.token!, { limit: 100 }),
  ]);

  const article = articlesResult.items.find((item) => item.id === params.id);
  if (!article) throw error(404, 'Article not found');

  return { article, categories, tags, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const parsed = updateArticleSchema.safeParse(parseArticleForm(formData));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await updateArticle(locals.token!, params.id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/articles');
  },
};
