<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import MarkdownRenderer from '$lib/components/content/MarkdownRenderer.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { populated } from '$lib/utils/populated.js';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { breadcrumbJsonLd } from '$lib/utils/jsonld.js';
  import { formatDate } from '$lib/utils/date.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const project = $derived(data.project);
  const cover = $derived(populated(project.coverImage));
  const category = $derived(populated(project.category));
  const tags = $derived(project.tags.map(populated).filter(Boolean));
  const seo = $derived(
    resolveSeo(
      siteUrl,
      `/projects/${project.slug}`,
      data.settings.seoDefaults,
      project.seo,
      project.title,
      project.summary,
    ),
  );
  const breadcrumbs = $derived(
    breadcrumbJsonLd(siteUrl, [
      { name: 'Projects', path: '/projects' },
      { name: project.title, path: `/projects/${project.slug}` },
    ]),
  );
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  type="article"
  jsonLd={breadcrumbs}
/>

<article class="container page">
  <a href="/projects" class="back">← All projects</a>

  <header class="page-header">
    {#if category}<Badge variant="accent">{category.name}</Badge>{/if}
    <h1>{project.title}</h1>
    <p class="summary">{project.summary}</p>

    <dl class="meta">
      <div>
        <dt>Role</dt>
        <dd>{project.role || '—'}</dd>
      </div>
      <div>
        <dt>Timeline</dt>
        <dd>
          {formatDate(project.startDate, { day: undefined })}{#if project.endDate}
            – {formatDate(project.endDate, { day: undefined })}{:else} – Present{/if}
        </dd>
      </div>
    </dl>

    <div class="links">
      {#if project.links.repoUrl}<a href={project.links.repoUrl} target="_blank" rel="noopener noreferrer">Source code →</a>{/if}
      {#if project.links.liveUrl}<a href={project.links.liveUrl} target="_blank" rel="noopener noreferrer">Live site →</a>{/if}
      {#if project.links.caseStudyUrl}<a href={project.links.caseStudyUrl} target="_blank" rel="noopener noreferrer">Case study →</a>{/if}
    </div>
  </header>

  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" width="1200" height="800" />
  {/if}

  {#if project.techStack.length > 0}
    <ul class="tech-stack">
      {#each project.techStack as tech (tech)}
        <li><Badge variant="neutral">{tech}</Badge></li>
      {/each}
    </ul>
  {/if}

  <MarkdownRenderer html={data.descriptionHtml} />

  {#if tags.length > 0}
    <ul class="tags">
      {#each tags as tag (tag.id)}
        <li><Badge variant="accent">{tag.name}</Badge></li>
      {/each}
    </ul>
  {/if}
</article>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
    max-width: var(--prose-max-width);
    margin-inline: auto;
  }

  .back {
    display: inline-block;
    margin-bottom: var(--space-5);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .page-header {
    margin-bottom: var(--space-6);
  }

  .page-header h1 {
    margin-top: var(--space-3);
  }

  .summary {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-5);
  }

  .meta {
    display: flex;
    gap: var(--space-8);
    margin: 0 0 var(--space-4);
  }

  .meta dt {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  .meta dd {
    margin: 0;
    font-weight: var(--font-weight-medium);
  }

  .links {
    display: flex;
    gap: var(--space-5);
    flex-wrap: wrap;
  }

  .cover {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-6);
  }

  .tech-stack,
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: 0 0 var(--space-6);
    padding: 0;
  }

  .tags {
    margin-top: var(--space-6);
  }
</style>
