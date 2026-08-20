<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import PhotoFeed from '$lib/components/content/PhotoFeed.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { breadcrumbJsonLd } from '$lib/utils/jsonld.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const album = $derived(data.album);
  const seo = $derived(
    resolveSeo(
      siteUrl,
      `/photos/${album.slug}`,
      data.settings.seoDefaults,
      album.seo,
      album.title,
      album.description || data.settings.seoDefaults.description,
    ),
  );
  const breadcrumbs = $derived(
    breadcrumbJsonLd(siteUrl, [
      { name: 'Photos', path: '/photos' },
      { name: album.title, path: `/photos/${album.slug}` },
    ]),
  );
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  jsonLd={breadcrumbs}
/>

<div class="container header-wrap">
  <a href="/photos" class="back">← All photos</a>

  <header class="page-header">
    <h1>{album.title}</h1>
    {#if album.description}
      <p class="description">{album.description}</p>
    {/if}
  </header>
</div>

{#if data.photos.length === 0}
  <div class="container">
    <EmptyState title="No photos yet" description="Check back soon for photos in this album." />
  </div>
{:else}
  <PhotoFeed photos={data.photos} />
{/if}

<style>
  .header-wrap {
    padding-block: var(--space-8) var(--space-6);
  }

  .back {
    display: inline-block;
    margin-bottom: var(--space-5);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .page-header {
    max-width: var(--prose-max-width);
  }

  .page-header h1 {
    margin-bottom: var(--space-3);
  }

  .description {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin: 0;
  }
</style>
