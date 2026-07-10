import type { PageServerLoad } from './$types.js';
import { listProjects } from '$lib/api/projects.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const category = url.searchParams.get('category') ?? undefined;
  const tag = url.searchParams.get('tag') ?? undefined;

  const [result, categories, tags] = await Promise.all([
    listProjects({ page, limit: 9, category, tag }),
    listCategories(),
    listTags(),
  ]);

  return {
    projects: result.items,
    meta: result.meta,
    categories,
    tags,
    filters: { category: category ?? '', tag: tag ?? '' },
  };
};
