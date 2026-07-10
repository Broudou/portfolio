import type { PageServerLoad } from './$types.js';
import { listArticles } from '$lib/api/articles.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const category = url.searchParams.get('category') ?? undefined;
  const tag = url.searchParams.get('tag') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;

  const [result, categories, tags] = await Promise.all([
    listArticles({ page, limit: 8, category, tag, q }),
    listCategories(),
    listTags(),
  ]);

  return {
    articles: result.items,
    meta: result.meta,
    categories,
    tags,
    filters: { category: category ?? '', tag: tag ?? '', q: q ?? '' },
  };
};
