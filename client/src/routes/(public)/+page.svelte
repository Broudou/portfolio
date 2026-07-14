<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
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
    {#if avatar}
      <img src={avatar.url} alt={avatar.altText} class="avatar" width="96" height="96" />
    {/if}
    <div>
      <p class="eyebrow">{data.settings.tagline}</p>
      <h1>{data.biography.fullName}</h1>
      <p class="headline">{data.biography.headline}</p>
      <p class="summary">{data.biography.summary}</p>
    </div>
  </section>
{/if}

{#if data.featuredProjects.length > 0}
  <section class="container section" aria-label="Featured projects">
    <div class="list">
      {#each data.featuredProjects as project (project.id)}
        <ProjectListItem {project} />
      {/each}
    </div>
  </section>
{/if}

{#if data.featuredArticles.length > 0}
  <section class="container section pastel" aria-label="Latest writing">
    <div class="list">
      {#each data.featuredArticles as article (article.id)}
        <ArticleListItem {article} />
      {/each}
    </div>
  </section>
{/if}

<style>
  .hero {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-4);
    align-items: center;
    padding-block: var(--space-6);
  }

  .avatar {
    width: 96px;
    height: 96px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  .eyebrow {
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-1);
  }

  .hero h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-1);
  }

  .headline {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .summary {
    max-width: 60ch;
    margin-bottom: 0;
  }

  .section {
    padding-block: var(--space-7);
  }

  .section.pastel {
    background: var(--color-pastel-blue);
    border-radius: var(--radius-lg);
  }

  .list {
    max-width: var(--prose-max-width);
  }

  @media (max-width: 640px) {
    .hero {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .avatar {
      margin-inline: auto;
    }
  }
</style>
