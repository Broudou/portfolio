<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import PublicationItem from '$lib/components/content/PublicationItem.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(
      siteUrl,
      '/publications',
      data.settings.seoDefaults,
      undefined,
      'Publications & Talks',
      'Conference talks, workshops, and written publications.',
    ),
  );
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  <header class="page-header">
    <h1>Publications & Talks</h1>
    <p>Conference talks, workshops, and written publications.</p>
  </header>

  {#if data.publications.length === 0}
    <EmptyState title="Nothing published yet" />
  {:else}
    <div class="list">
      {#each data.publications as publication (publication.id)}
        <PublicationItem {publication} />
      {/each}
    </div>
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
    max-width: var(--prose-max-width);
  }
</style>
