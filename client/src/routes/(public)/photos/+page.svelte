<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import PhotoAlbumCard from '$lib/components/content/PhotoAlbumCard.svelte';
  import PhotoCarousel from '$lib/components/content/PhotoCarousel.svelte';
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
    resolveSeo(siteUrl, '/photos', data.settings.seoDefaults, undefined, 'Photos', 'Photo albums from behind the scenes.'),
  );

  function buildHref(pageNum: number): string {
    return `/photos?page=${pageNum}`;
  }
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  {#if data.lastAlbum && data.lastAlbumPhotos.length > 0}
    <a class="last-album-link" href="/photos/{data.lastAlbum.slug}">{data.lastAlbum.title}</a>
    <PhotoCarousel photos={data.lastAlbumPhotos} />
  {/if}

  {#if data.albums.length === 0}
    <EmptyState title="No albums found" description="Check back soon for new photos." />
  {:else}
    <div class="list">
      {#each data.albums as album (album.id)}
        <PhotoAlbumCard {album} />
      {/each}
    </div>
    <Pagination meta={data.meta} {buildHref} />
  {/if}
</div>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .last-album-link {
    display: block;
    margin-bottom: var(--space-4);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--font-size-base);
    transition: color var(--duration-base) var(--easing-standard);
  }

  .last-album-link:hover,
  .last-album-link:focus-visible {
    color: var(--color-accent);
  }

  :global(.last-album-link + .carousel) {
    margin-bottom: var(--space-8);
  }

  .list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }

  @media (max-width: 768px) {
    .list {
      grid-template-columns: 1fr;
    }
  }
</style>
