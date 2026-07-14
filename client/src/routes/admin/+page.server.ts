import type { PageServerLoad } from './$types.js';
import { listProjects } from '$lib/api/projects.js';
import { listArticles } from '$lib/api/articles.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';
import { listTimelineEvents } from '$lib/api/timeline.js';

export const load: PageServerLoad = async ({ locals, parent }) => {
  const { unreadMessagesCount } = await parent();
  const token = locals.token!;

  const [projects, articles, categories, tags, timeline] = await Promise.all([
    listProjects({ token, limit: 1 }),
    listArticles({ token, limit: 1 }),
    listCategories(),
    listTags(),
    listTimelineEvents(),
  ]);

  return {
    counts: {
      projects: projects.meta.total,
      articles: articles.meta.total,
      categories: categories.length,
      tags: tags.length,
      timeline: timeline.length,
      unreadMessages: unreadMessagesCount,
    },
  };
};
