import { fail, redirect } from '@sveltejs/kit';
import { createPublicationSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { createPublication } from '$lib/api/publications.js';
import { listMedia } from '$lib/api/media.js';
import { parsePublicationForm } from '$lib/server/parsePublicationForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals }) => {
  const mediaResult = await listMedia(locals.token!, { limit: 100 });
  return { media: mediaResult.items };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createPublicationSchema.safeParse(parsePublicationForm(formData));
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await createPublication(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/publications');
  },
};
