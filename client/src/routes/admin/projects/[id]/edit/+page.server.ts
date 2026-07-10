import { error, fail, redirect } from '@sveltejs/kit';
import { updateProjectSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { listProjects, updateProject } from '$lib/api/projects.js';
import { listCategories } from '$lib/api/categories.js';
import { listTags } from '$lib/api/tags.js';
import { listMedia } from '$lib/api/media.js';
import { parseProjectForm } from '$lib/server/parseProjectForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [projectsResult, categories, tags, mediaResult] = await Promise.all([
    listProjects({ token: locals.token, limit: 100 }),
    listCategories(),
    listTags(),
    listMedia(locals.token!, { limit: 100 }),
  ]);

  const project = projectsResult.items.find((item) => item.id === params.id);
  if (!project) throw error(404, 'Project not found');

  return { project, categories, tags, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const parsed = updateProjectSchema.safeParse(parseProjectForm(formData));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await updateProject(locals.token!, params.id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/projects');
  },
};
