import type { PageServerLoad } from './$types.js';
import type { Photo } from '@portfolio/shared';
import { listAlbums } from '$lib/api/albums.js';
import { listPhotosByAlbum } from '$lib/api/photos.js';

const PAGE_SIZE = 8;

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');

  // Fetch every album once so picking the most recently created one (for the
  // carousel) and excluding it from the grid stay consistent across pages.
  // `order` (the grid's own sort) is manually curated and doesn't track
  // creation recency, so the excluded album could otherwise land outside
  // whichever page-sized slice we'd paginate server-side, leaving nothing
  // for the exclusion to actually remove.
  const allAlbums = await listAlbums({ limit: 100 });

  const lastAlbum =
    [...allAlbums.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0] ?? null;

  const lastAlbumPhotos = page === 1 && lastAlbum ? await listPhotosByAlbum(lastAlbum.id) : ([] as Photo[]);

  // Avoid showing the featured album twice — once in the carousel, once as a
  // card — by excluding it before paginating, not after.
  const gridAlbums = lastAlbum
    ? allAlbums.items.filter((album) => album.id !== lastAlbum.id)
    : allAlbums.items;

  const total = gridAlbums.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const albums = gridAlbums.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    albums,
    meta: { page, limit: PAGE_SIZE, total, totalPages },
    lastAlbum: page === 1 ? lastAlbum : null,
    lastAlbumPhotos,
  };
};
