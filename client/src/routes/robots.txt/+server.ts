import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${url.origin}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
