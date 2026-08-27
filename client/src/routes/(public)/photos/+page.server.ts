import type { PageServerLoad } from './$types.js';
import type { Photo } from '@portfolio/shared';
import { listAlbums } from '$lib/api/albums.js';
import { listPhotosByAlbum } from '$lib/api/photos.js';

const PAGE_SIZE = 8;

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');

  // Fetch every album once: the grid is a plain slice of this (order-sorted)
  // set — every album, including the featured one, appears as a card — and
  // the same data lets us reliably pick the most recently created album for
  // the carousel. `order` is manually curated and doesn't track creation
  // recency, so a smaller paginated query alone couldn't do that reliably.
  const allAlbums = await listAlbums({ limit: 100 });

  const lastAlbum =
    [...allAlbums.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0] ?? null;

  const lastAlbumPhotos = page === 1 && lastAlbum ? await listPhotosByAlbum(lastAlbum.id) : ([] as Photo[]);

  const total = allAlbums.items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const albums = allAlbums.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    albums,
    meta: { page, limit: PAGE_SIZE, total, totalPages },
    lastAlbum: page === 1 ? lastAlbum : null,
    lastAlbumPhotos,
  };
};
