<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import MarkdownRenderer from '$lib/components/content/MarkdownRenderer.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { populated } from '$lib/utils/populated.js';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { articleJsonLd, breadcrumbJsonLd } from '$lib/utils/jsonld.js';
  import { formatDate } from '$lib/utils/date.js';
  import { formatReadingTime } from '$lib/utils/readingTime.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const article = $derived(data.article);
  const cover = $derived(populated(article.coverImage));
  const category = $derived(populated(article.category));
  const author = $derived(populated(article.author));
  const tags = $derived(article.tags.map(populated).filter(Boolean));
  const seo = $derived(
    resolveSeo(
      siteUrl,
      `/articles/${article.slug}`,
      data.settings.seoDefaults,
      article.seo,
      article.title,
      article.excerpt,
    ),
  );
  const jsonLd = $derived([
    articleJsonLd(siteUrl, article, author?.name ?? data.settings.siteTitle, seo.ogImageUrl),
    breadcrumbJsonLd(siteUrl, [
      { name: 'Articles', path: '/articles' },
      { name: article.title, path: `/articles/${article.slug}` },
    ]),
  ]);
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  type="article"
  {jsonLd}
/>

<article class="container page">
  <a href="/articles" class="back">← All articles</a>

  <header class="page-header">
    {#if category}<Badge variant="accent">{category.name}</Badge>{/if}
    <h1>{article.title}</h1>
    <p class="meta">
      {#if author}<span>{author.name}</span> · {/if}
      <time datetime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
      · {formatReadingTime(article.readingTimeMinutes)}
    </p>
  </header>

  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" width="1200" height="800" />
  {/if}

  <MarkdownRenderer html={data.contentHtml} />

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

  .meta {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .cover {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-6);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: var(--space-6) 0 0;
    padding: 0;
  }
</style>
