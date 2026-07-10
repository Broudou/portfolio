import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getProjectBySlug } from '$lib/api/projects.js';
import { renderMarkdown } from '$lib/utils/markdown.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const project = await getProjectBySlug(params.slug);
    const descriptionHtml = await renderMarkdown(project.descriptionMarkdown);
    return { project, descriptionHtml };
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      throw error(404, 'Project not found');
    }
    throw err;
  }
};
