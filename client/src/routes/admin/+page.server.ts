import type { PageServerLoad } from './$types.js';
import { listProjects } from '$lib/api/projects.js';
import { listArticles } from '$lib/api/articles.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';
import { listAlbums } from '$lib/api/albums.js';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { unreadMessagesCount } = await parent();
  const token = locals.token!;

  const [projects, articles, categories, tags, albums] = await Promise.all([
    listProjects({ token, limit: 1 }),
    listArticles({ token, limit: 1 }),
    listCategories(),
    listTags(),
    listAlbums({ token, limit: 1 }),
  ]);

  return {
    counts: {
      projects: projects.meta.total,
      articles: articles.meta.total,
      categories: categories.length,
      tags: tags.length,
      albums: albums.meta.total,
      unreadMessages: unreadMessagesCount,
    },
  };
};
