import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { deleteMedia, listMedia, updateMedia, uploadMedia } from '$lib/api/media.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const result = await listMedia(locals.token!, { page, limit: 24 });
  return { media: result.items, meta: result.meta };
};

export const actions: Actions = {
  upload: async ({ request, locals }) => {
    const formData = await request.formData();
    const file = formData.get('file');
    const altText = String(formData.get('altText') ?? '').trim();

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { message: 'Please choose a file to upload.' });
    }
    if (!altText) {
      return fail(400, { message: 'Alt text is required.' });
    }

    try {
      const media = await uploadMedia(locals.token!, file, altText);
      return { media };
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
  },

  updateAlt: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    const altText = String(formData.get('altText') ?? '').trim();
    if (!altText) return fail(400, { message: 'Alt text is required.' });

    try {
      await updateMedia(locals.token!, id, altText);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { updated: true };
  },

  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deleteMedia(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
