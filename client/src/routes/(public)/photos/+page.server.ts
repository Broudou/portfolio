import type { PageServerLoad } from './$types.js';
import { listAlbums } from '$lib/api/albums.js';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');

  const result = await listAlbums({ page, limit: 8 });

  return { albums: result.items, meta: result.meta };
};
