import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getAlbumBySlug } from '$lib/api/albums.js';
import { listPhotosByAlbum } from '$lib/api/photos.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const album = await getAlbumBySlug(params.slug);
    const photos = await listPhotosByAlbum(album.id);
    return { album, photos };
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      throw error(404, 'Album not found');
    }
    throw err;
  }
};
