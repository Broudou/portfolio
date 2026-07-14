<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import Hero from '$lib/components/content/Hero.svelte';
  import ProjectListItem from '$lib/components/content/ProjectListItem.svelte';
  import ArticleListItem from '$lib/components/content/ArticleListItem.svelte';
  import { populated } from '$lib/utils/populated.js';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { personJsonLd } from '$lib/utils/jsonld.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(resolveSeo(siteUrl, '/', data.settings.seoDefaults));
  const avatar = $derived(data.biography ? populated(data.biography.avatar) : null);
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  twitterHandle={seo.twitterHandle}
  type="profile"
  jsonLd={data.biography ? personJsonLd(siteUrl, data.biography, avatar?.url) : undefined}
/>

{#if data.biography}
  <section class="hero container">
    <Hero fullName={data.biography.fullName} headline={data.biography.headline} summary={data.biography.summary} {avatar} />
  </section>
{/if}

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

<style>
  .hero {
    padding-block: var(--space-6);
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
</style>
