import type { PageServerLoad } from './$types.js';
import type { Article, Photo, Project } from '@portfolio/shared';
import { listProjects } from '$lib/api/projects.js';
import { listArticles } from '$lib/api/articles.js';
import { listAlbums } from '$lib/api/albums.js';
import { listPhotosByAlbum } from '$lib/api/photos.js';

const FETCH_LIMIT = 50;

/**
 * The homepage only ever renders featured projects, featured articles, and
 * featured photo albums, so nothing else is fetched here even if other
 * section types are still configured/enabled in Settings.homepageSections.
 * Albums are always fetched (regardless of the "photos" section toggle)
 * since the "Last Album" carousel needs them independently of that section.
 */
export const load: PageServerLoad = async ({ parent }) => {
  const { settings } = await parent();
  const sections = [...settings.homepageSections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionLimit = (type: string, fallback: number) =>
    sections.find((section) => section.type === type)?.limit ?? fallback;

  const needs = (type: string) => sections.some((section) => section.type === type);

  const [projectsResult, articlesResult, albumsResult] = await Promise.all([
    needs('featuredProjects')
      ? listProjects({ limit: FETCH_LIMIT })
      : Promise.resolve({ items: [] as Project[], meta: null }),
    needs('featuredArticles')
      ? listArticles({ limit: FETCH_LIMIT })
      : Promise.resolve({ items: [] as Article[], meta: null }),
    listAlbums({ limit: FETCH_LIMIT }),
  ]);

  const lastAlbum =
    [...albumsResult.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0] ?? null;

  const lastAlbumPhotos = lastAlbum ? await listPhotosByAlbum(lastAlbum.id) : ([] as Photo[]);

  return {
    featuredProjects: projectsResult.items
      .filter((project) => project.featured)
      .slice(0, sectionLimit('featuredProjects', 3)),
    featuredArticles: articlesResult.items
      .filter((article) => article.featured)
      .slice(0, sectionLimit('featuredArticles', 3)),
    featuredAlbums: needs('photos')
      ? albumsResult.items.filter((album) => album.featured).slice(0, sectionLimit('photos', 3))
      : [],
    lastAlbum,
    lastAlbumPhotos,
    hasHeroBackground: settings.homeBackground.type !== 'none' && !!settings.homeBackground.media,
  };
};
