import { error, fail, redirect } from '@sveltejs/kit';
import { updatePublicationSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { listPublications, updatePublication } from '$lib/api/publications.js';
import { listMedia } from '$lib/api/media.js';
import { parsePublicationForm } from '$lib/server/parsePublicationForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [publications, mediaResult] = await Promise.all([
    listPublications(),
    listMedia(locals.token!, { limit: 100 }),
  ]);
  const publication = publications.find((item) => item.id === params.id);
  if (!publication) throw error(404, 'Publication not found');
  return { publication, media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const parsed = updatePublicationSchema.safeParse(parsePublicationForm(formData));
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await updatePublication(locals.token!, params.id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/publications');
  },
};
