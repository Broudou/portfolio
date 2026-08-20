import { error, fail } from '@sveltejs/kit';
import { updateAlbumSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { listAlbums, updateAlbum } from '$lib/api/albums.js';
import {
  addPhotos as addPhotosApi,
  deletePhoto as deletePhotoApi,
  listPhotosByAlbum,
  reorderPhotos as reorderPhotosApi,
} from '$lib/api/photos.js';
import { parseAlbumForm } from '$lib/server/parseAlbumForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [albumsResult, photos] = await Promise.all([
    listAlbums({ token: locals.token, limit: 100 }),
    listPhotosByAlbum(params.id, locals.token),
  ]);

  const album = albumsResult.items.find((item) => item.id === params.id);
  if (!album) throw error(404, 'Album not found');

  return { album, photos };
};

export const actions: Actions = {
  save: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const parsed = updateAlbumSchema.safeParse(parseAlbumForm(formData));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten().fieldErrors });
    }

    try {
      await updateAlbum(locals.token!, params.id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },

  addPhotos: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return fail(400, { message: 'Please choose at least one photo to upload.' });
    }

    try {
      await addPhotosApi(locals.token!, params.id, files);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },

  deletePhoto: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));

    try {
      await deletePhotoApi(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },

  reorderPhotos: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const items = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('order_'))
      .map(([key, value]) => ({ id: key.slice('order_'.length), order: Number(value) }));

    try {
      await reorderPhotosApi(locals.token!, params.id, items);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    return { success: true };
  },
};
