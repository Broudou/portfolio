import type { HydratedDocument } from 'mongoose';
import { Article } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';
import type { CategoryDocument } from '../../models/Category.model.js';
import type { TagDocument } from '../../models/Tag.model.js';

interface SeedContext {
  authorId: string;
  categories: Record<string, HydratedDocument<CategoryDocument>>;
  tags: Record<string, HydratedDocument<TagDocument>>;
  media: Record<string, { id: string }>;
}

export async function seedArticles(ctx: SeedContext): Promise<void> {
  const { authorId, categories, tags, media } = ctx;

  const articles = [
    {
      title: 'Distributed Tracing Without the Ceremony',
      excerpt:
        'You do not need a six-month platform project to get useful traces. Here is the smallest setup that pays for itself in the first incident.',
      contentMarkdown: `Most teams delay distributed tracing because it sounds like a platform
project: a collector cluster, a storage backend, a query UI, a rollout plan.
You can get 80% of the value with a fraction of that.

## Start with propagation, not storage

The highest-leverage first step is making sure a trace ID survives every hop.
If you only do one thing, do this:

\`\`\`ts
app.use((req, res, next) => {
  req.traceId = req.headers['x-trace-id'] ?? crypto.randomUUID();
  res.setHeader('x-trace-id', req.traceId);
  next();
});
\`\`\`

Propagate that header on every outbound call your service makes, and log it
on every line. You now have a free-text way to grep "everything that happened
for this request" across services, long before you've stood up a real
tracing backend.

## Add spans where debugging actually hurts

Rather than instrumenting everything, instrument the boundaries that have
burned you before: outbound HTTP calls, database queries over some latency
threshold, and queue publish/consume.

\`\`\`bash
# a trace ID turns "check five services' logs" into one query
grep "trace_id=4c9f..." /var/log/*/app.log
\`\`\`

## When to graduate to a real backend

Once grep-based correlation starts to hurt — too many services, too much
volume — that's your signal to invest in OpenTelemetry and a proper backend.
Not before. The propagation habit you built in week one is exactly what makes
that later migration painless: every span already carries the right context.`,
      category: categories.Backend.id,
      tagNames: ['Node.js', 'System Design', 'Performance'],
      coverImage: media['article-distributed-tracing'].id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2025-09-12'),
    },
    {
      title: 'End-to-End Type Safety Without a Monorepo Headache',
      excerpt:
        'Sharing types between an Express API and a SvelteKit client does not require a heavyweight codegen pipeline.',
      contentMarkdown: `A common objection to "just share your types" is that it implies a
complicated build pipeline. It does not have to.

## Ship source, not a build artifact

If your shared package is plain TypeScript and your bundlers (Vite, esbuild)
already handle TypeScript, you don't need a compile step for the shared
package at all:

\`\`\`json
{
  "name": "@app/shared",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
\`\`\`

Both the client and server import straight from source. There is no
dist/ to go stale, no "did you rebuild shared?" step in your onboarding docs.

## Validate once, reuse everywhere

Pairing this with zod gets you both compile-time types and runtime validation
from a single definition:

\`\`\`ts
export const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  status: z.enum(['draft', 'published']),
});
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
\`\`\`

The server uses the schema to validate incoming requests; the client uses the
inferred type to build type-checked forms against the exact same contract.

## The payoff

When a field is renamed, TypeScript breaks the build everywhere it's used —
client and server — instead of failing silently at runtime three weeks later.`,
      category: categories.Architecture.id,
      tagNames: ['TypeScript', 'SvelteKit', 'Node.js'],
      coverImage: media['article-typed-apis'].id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2025-11-03'),
    },
    {
      title: 'The Index You Forgot Costs More Than the Query You Optimized',
      excerpt:
        'A field guide to reading MongoDB explain() output and catching the collection scans hiding in plain sight.',
      contentMarkdown: `It's easy to spend an afternoon shaving milliseconds off a hot query while a
much simpler win — a missing index — sits unnoticed on a less-frequently-hit
endpoint that's quietly doing a full collection scan under load.

## Read explain() like a checklist

\`\`\`js
db.articles.find({ status: 'published', category: catId }).explain('executionStats')
\`\`\`

Look for \`COLLSCAN\` in \`winningPlan\`. If you see it on a query that runs on
every page load, that's your first fix — usually before anything fancier.

## Compound indexes follow query shape, not intuition

An index on \`{ status: 1, publishedAt: -1 }\` serves "published articles sorted
by date" efficiently; an index on \`{ publishedAt: -1, status: 1 }\` mostly
does not, because MongoDB can't use the sort-friendly prefix once the
equality filter isn't the leading field.

## A five-minute audit worth doing quarterly

List your top ten most-called endpoints, run \`explain()\` on their underlying
queries, and check for \`COLLSCAN\` or examined-to-returned ratios far above 1.
It consistently finds more performance headroom than micro-optimizing
application code.`,
      category: categories.Backend.id,
      tagNames: ['MongoDB', 'Performance'],
      coverImage: media['article-database-indexing'].id,
      status: 'published' as const,
      featured: false,
      publishedAt: new Date('2026-01-20'),
    },
    {
      title: 'Notes on Moving a Content Site to SvelteKit SSR (Draft)',
      excerpt:
        'Early notes from an in-progress migration — what has been straightforward, and what has not.',
      contentMarkdown: `This is a working draft I'm using to track decisions while migrating a
content-heavy site to SvelteKit with server-side rendering.

## What's been easy

- Per-route data loading via \`+page.server.ts\` mapped cleanly onto our
  existing REST API.
- The auth-guard pattern (server \`load\` redirecting unauthenticated users)
  removed an entire class of "flash of protected content" bugs we had with
  our previous client-only guard.

## Open questions

- Where should Markdown rendering live — at request time in \`+page.server.ts\`,
  or precomputed at publish time? Leaning toward request-time with caching
  headers for now.
- Image pipeline: still deciding between a build-time responsive-image
  plugin and an on-request resizing service.

More to come once the migration is further along.`,
      category: categories.Frontend.id,
      tagNames: ['SvelteKit', 'Performance'],
      coverImage: media['article-svelte-ssr'].id,
      status: 'draft' as const,
      featured: false,
      publishedAt: null,
    },
  ];

  for (const article of articles) {
    const { tagNames, ...rest } = article;
    await Article.create({
      ...rest,
      slug: slugify(article.title),
      author: authorId,
      tags: tagNames.map((name) => tags[name]?.id).filter(Boolean),
    });
  }
}
