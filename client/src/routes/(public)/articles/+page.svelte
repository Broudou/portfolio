<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import ArticleCard from '$lib/components/content/ArticleCard.svelte';
  import TagFilterBar from '$lib/components/content/TagFilterBar.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(siteUrl, '/articles', data.settings.seoDefaults, undefined, 'Articles', 'Technical writing on backend systems, performance, and developer tooling.'),
  );

  function buildHref(pageNum: number): string {
    const params = new URLSearchParams();
    if (data.filters.category) params.set('category', data.filters.category);
    if (data.filters.tag) params.set('tag', data.filters.tag);
    if (data.filters.q) params.set('q', data.filters.q);
    params.set('page', String(pageNum));
    return `/articles?${params.toString()}`;
  }
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  <header class="page-header">
    <h1>Articles</h1>
    <p>Notes on distributed systems, API design, and the occasional postmortem lesson.</p>
  </header>

  <TagFilterBar
    action="/articles"
    categories={data.categories}
    tags={data.tags}
    selectedCategory={data.filters.category}
    selectedTag={data.filters.tag}
    searchQuery={data.filters.q}
    showSearch
  />

  {#if data.articles.length === 0}
    <EmptyState title="No articles found" description="Try a different search or clear the filters above." />
  {:else}
    <div class="list">
      {#each data.articles as article (article.id)}
        <ArticleCard {article} />
      {/each}
    </div>
    <Pagination meta={data.meta} {buildHref} />
  {/if}
</div>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .page-header {
    max-width: var(--prose-max-width);
    margin-bottom: var(--space-7);
  }

  .page-header p {
    color: var(--color-text-secondary);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }
</style>
