<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import PhotoAlbumCard from '$lib/components/content/PhotoAlbumCard.svelte';
  import PhotoCarousel from '$lib/components/content/PhotoCarousel.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { pageChrome } from '$lib/stores/pageChrome.svelte.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(siteUrl, '/photos', data.settings.seoDefaults, undefined, 'Photos', 'Photo albums from behind the scenes.'),
  );
  const hasHero = $derived(!!(data.lastAlbum && data.lastAlbumPhotos.length > 0));

  function buildHref(pageNum: number): string {
    return `/photos?page=${pageNum}`;
  }

  // Scroll-snap between the hero carousel and the card grid below. Scoped to
  // this page's lifetime (rather than global CSS) so no other route gets
  // snap behavior; `scroll-padding-top` keeps the fixed nav from covering
  // the top of whichever section is snapped into view.
  $effect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('photos-snap', hasHero);
    root.style.scrollPaddingTop = `${pageChrome.navHeight}px`;
  });

  onDestroy(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('photos-snap');
    document.documentElement.style.scrollPaddingTop = '';
  });
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page" class:has-hero={hasHero}>
  {#if hasHero}
    <div
      class="hero-carousel"
      style="height: calc(100vh - {pageChrome.navHeight}px); height: calc(100dvh - {pageChrome.navHeight}px);"
    >
      <a class="last-album-link" href="/photos/{data.lastAlbum!.slug}">{data.lastAlbum!.title}</a>
      <PhotoCarousel photos={data.lastAlbumPhotos} fill />
    </div>
  {/if}

  <div class="cards-section">
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
</div>

<style>
  :global(html.photos-snap) {
    scroll-snap-type: y mandatory;
  }

  /* Mobile: let the cards scroll into view normally instead of being
     snap-locked behind a full-screen carousel section. */
  @media (max-width: 768px) {
    :global(html.photos-snap) {
      scroll-snap-type: none;
    }

    .hero-carousel {
      scroll-snap-align: none;
      scroll-snap-stop: normal;
    }

    .cards-section {
      scroll-snap-align: none;
    }
  }

  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .page.has-hero {
    padding-top: 0;
  }

  .hero-carousel {
    display: flex;
    flex-direction: column;
    padding-block: var(--space-6) var(--space-8);
    box-sizing: border-box;
    overflow: hidden;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .cards-section {
    scroll-snap-align: start;
  }

  .hero-carousel :global(.carousel) {
    flex: 1;
    min-height: 0;
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
