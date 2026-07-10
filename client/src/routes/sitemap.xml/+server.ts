import type { RequestHandler } from './$types.js';
import { listProjects } from '$lib/api/projects.js';
import { listArticles } from '$lib/api/articles.js';

const STATIC_PATHS = ['/', '/biography', '/projects', '/articles', '/publications', '/timeline', '/contact'];

export const GET: RequestHandler = async ({ url }) => {
  const siteUrl = url.origin;

  const [projects, articles] = await Promise.all([
    listProjects({ limit: 50 }),
    listArticles({ limit: 50 }),
  ]);

  const urls = [
    ...STATIC_PATHS.map((path) => ({ loc: `${siteUrl}${path}`, lastmod: undefined as string | undefined })),
    ...projects.items.map((project) => ({
      loc: `${siteUrl}/projects/${project.slug}`,
      lastmod: project.updatedAt,
    })),
    ...articles.items.map((article) => ({
      loc: `${siteUrl}/articles/${article.slug}`,
      lastmod: article.updatedAt,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) =>
      `  <url><loc>${entry.loc}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
