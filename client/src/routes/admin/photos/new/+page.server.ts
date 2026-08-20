import { fail, redirect } from '@sveltejs/kit';
import { createAlbumSchema } from '@portfolio/shared';
import type { Actions } from './$types.js';
import { createAlbum } from '$lib/api/albums.js';
import { parseAlbumForm } from '$lib/server/parseAlbumForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createAlbumSchema.safeParse(parseAlbumForm(formData));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    let album;
    try {
      album = await createAlbum(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, `/admin/photos/${album.id}/edit`);
  },
};
