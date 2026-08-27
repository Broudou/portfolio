import type { PageServerLoad } from './$types.js';
import type { Photo } from '@portfolio/shared';
import { listAlbums } from '$lib/api/albums.js';
import { listPhotosByAlbum } from '$lib/api/photos.js';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');

  // The grid itself only needs the current (order-sorted) page, but picking
  // the most recently created album for the carousel above it requires
  // looking across a much larger batch — `order` is manually curated and
  // doesn't track creation recency.
  const [result, recentAlbumsResult] = await Promise.all([
    listAlbums({ page, limit: 8 }),
    page === 1 ? listAlbums({ limit: 50 }) : Promise.resolve(null),
  ]);

  const lastAlbum = recentAlbumsResult
    ? ([...recentAlbumsResult.items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ?? null)
    : null;

  const lastAlbumPhotos = lastAlbum ? await listPhotosByAlbum(lastAlbum.id) : ([] as Photo[]);

  return { albums: result.items, meta: result.meta, lastAlbum, lastAlbumPhotos };
};
