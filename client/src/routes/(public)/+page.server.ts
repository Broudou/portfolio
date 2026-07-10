import type { PageServerLoad } from './$types.js';
import type { Article, Project } from '@portfolio/shared';
import { getBiography } from '$lib/api/biography.js';
import { listProjects } from '$lib/api/projects.js';
import { listArticles } from '$lib/api/articles.js';
import { listTimelineEvents } from '$lib/api/timeline.js';
import { listPublications } from '$lib/api/publications.js';

const FETCH_LIMIT = 50;

export const load: PageServerLoad = async ({ parent }) => {
  const { settings } = await parent();
  const sections = [...settings.homepageSections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionLimit = (type: string, fallback: number) =>
    sections.find((section) => section.type === type)?.limit ?? fallback;

  const needs = (type: string) => sections.some((section) => section.type === type);

  const [biography, projectsResult, articlesResult, timelineEvents, publications] = await Promise.all([
    needs('hero') ? getBiography() : Promise.resolve(null),
    needs('featuredProjects')
      ? listProjects({ limit: FETCH_LIMIT })
      : Promise.resolve({ items: [] as Project[], meta: null }),
    needs('featuredArticles')
      ? listArticles({ limit: FETCH_LIMIT })
      : Promise.resolve({ items: [] as Article[], meta: null }),
    needs('timelinePreview') ? listTimelineEvents() : Promise.resolve([]),
    needs('publicationsPreview') ? listPublications() : Promise.resolve([]),
  ]);

  return {
    sections,
    biography,
    featuredProjects: projectsResult.items
      .filter((project) => project.featured)
      .slice(0, sectionLimit('featuredProjects', 3)),
    featuredArticles: articlesResult.items
      .filter((article) => article.featured)
      .slice(0, sectionLimit('featuredArticles', 3)),
    timelineEvents: timelineEvents
      .slice()
      .reverse()
      .slice(0, sectionLimit('timelinePreview', 5)),
    publications: publications.slice(0, sectionLimit('publicationsPreview', 2)),
  };
};
