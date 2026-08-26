<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import HeroBackground from '$lib/components/content/HeroBackground.svelte';
  import ProjectListItem from '$lib/components/content/ProjectListItem.svelte';
  import ArticleListItem from '$lib/components/content/ArticleListItem.svelte';
  import AlbumListItem from '$lib/components/content/AlbumListItem.svelte';
  import PhotoCarousel from '$lib/components/content/PhotoCarousel.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(resolveSeo(siteUrl, '/', data.settings.seoDefaults));
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  twitterHandle={seo.twitterHandle}
  type="profile"
/>

{#if data.hasHeroBackground}
  <HeroBackground background={data.settings.homeBackground} />
  <div class="home-hero-text container">
    <h1>{data.settings.siteTitle}</h1>
    <p>{data.settings.tagline}</p>
  </div>
{/if}

<div class="content-panel">
  {#if data.featuredArticles.length > 0}
    <section class="container section" aria-label="Latest writing">
      <h2 class="section-title">Latest Writing</h2>
      <div class="list">
        {#each data.featuredArticles as article (article.id)}
          <ArticleListItem {article} />
        {/each}
      </div>
    </section>
  {/if}

  {#if data.featuredProjects.length > 0}
    <section class="container section" aria-label="Featured projects">
      <h2 class="section-title">Featured Projects</h2>
      <div class="list">
        {#each data.featuredProjects as project (project.id)}
          <ProjectListItem {project} />
        {/each}
      </div>
    </section>
  {/if}

  {#if data.lastAlbum && data.lastAlbumPhotos.length > 0}
    <section class="container section" aria-label="Last album">
      <h2 class="section-title">Last Album</h2>
      <a class="album-title-link" href="/photos/{data.lastAlbum.slug}">{data.lastAlbum.title}</a>
      <PhotoCarousel photos={data.lastAlbumPhotos} />
    </section>
  {/if}

  {#if data.featuredAlbums.length > 0}
    <section class="container section" aria-label="Photos">
      <h2 class="section-title">Photos</h2>
      <div class="list">
        {#each data.featuredAlbums as album (album.id)}
          <AlbumListItem {album} />
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .home-hero-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    color: #ffffff;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    padding-block: var(--space-9) var(--space-8);
    box-sizing: border-box;
  }

  .home-hero-text h1 {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-3);
  }

  .home-hero-text p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    margin: 0;
  }

  /* Opaque so it reads normally once it scrolls up over the fixed
     background (when active) — sections inside are otherwise unstyled here. */
  .content-panel {
    background: var(--color-bg);
  }

  .section {
    padding-block: var(--space-7);
  }

  .section-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-6);
  }

  .list {
    max-width: var(--prose-max-width);
  }

  .album-title-link {
    display: block;
    max-width: var(--prose-max-width);
    margin-bottom: var(--space-4);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--font-size-base);
    transition: color var(--duration-base) var(--easing-standard);
  }

  .album-title-link:hover,
  .album-title-link:focus-visible {
    color: var(--color-accent);
  }
</style>
