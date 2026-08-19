<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import ProjectListItem from '$lib/components/content/ProjectListItem.svelte';
  import ArticleListItem from '$lib/components/content/ArticleListItem.svelte';
  import AlbumListItem from '$lib/components/content/AlbumListItem.svelte';
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

<style>
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
</style>
