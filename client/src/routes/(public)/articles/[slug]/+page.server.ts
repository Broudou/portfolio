import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticleBySlug } from '$lib/api/articles.js';
import { renderMarkdown } from '$lib/utils/markdown.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const article = await getArticleBySlug(params.slug);
    const contentHtml = await renderMarkdown(article.contentMarkdown);
    return { article, contentHtml };
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      throw error(404, 'Article not found');
    }
    throw err;
  }
};
