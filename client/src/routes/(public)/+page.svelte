<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import ProjectCard from '$lib/components/content/ProjectCard.svelte';
  import ArticleCard from '$lib/components/content/ArticleCard.svelte';
  import TimelineItem from '$lib/components/content/TimelineItem.svelte';
  import PublicationItem from '$lib/components/content/PublicationItem.svelte';
  import Button from '$lib/components/ui/Button.svelte';
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
      <img src={avatar.url} alt={avatar.altText} class="avatar" width="160" height="160" />
    {/if}
    <div>
      <p class="eyebrow">{data.settings.tagline}</p>
      <h1>{data.biography.fullName}</h1>
      <p class="headline">{data.biography.headline}</p>
      <p class="summary">{data.biography.summary}</p>
      <div class="cta">
        <Button href="/projects">View projects</Button>
        <Button href="/contact" variant="secondary">Get in touch</Button>
      </div>
    </div>
  </section>
{/if}

{#if data.featuredProjects.length > 0}
  <section class="container section">
    <div class="section-heading">
      <h2>Featured projects</h2>
      <a href="/projects">All projects →</a>
    </div>
    <div class="grid">
      {#each data.featuredProjects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>
{/if}

{#if data.featuredArticles.length > 0}
  <section class="container section pastel">
    <div class="section-heading">
      <h2>Latest writing</h2>
      <a href="/articles">All articles →</a>
    </div>
    <div class="grid">
      {#each data.featuredArticles as article (article.id)}
        <ArticleCard {article} />
      {/each}
    </div>
  </section>
{/if}

{#if data.timelineEvents.length > 0}
  <section class="container section">
    <div class="section-heading">
      <h2>Recent timeline</h2>
      <a href="/timeline">Full timeline →</a>
    </div>
    <ul class="timeline-list">
      {#each data.timelineEvents as event (event.id)}
        <TimelineItem {event} />
      {/each}
    </ul>
  </section>
{/if}

{#if data.publications.length > 0}
  <section class="container section pastel">
    <div class="section-heading">
      <h2>Talks & publications</h2>
      <a href="/publications">All publications →</a>
    </div>
    {#each data.publications as publication (publication.id)}
      <PublicationItem {publication} />
    {/each}
  </section>
{/if}

<style>
  .hero {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-6);
    align-items: center;
    padding-block: var(--space-9);
  }

  .avatar {
    width: 160px;
    height: 160px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  .eyebrow {
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-2);
  }

  .headline {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-3);
  }

  .summary {
    max-width: 60ch;
    margin-bottom: var(--space-5);
  }

  .cta {
    display: flex;
    gap: var(--space-3);
  }

  .section {
    padding-block: var(--space-8);
  }

  .section.pastel {
    background: var(--color-pastel-blue);
    border-radius: var(--radius-lg);
  }

  .section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--space-6);
  }

  .section-heading a {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
  }

  .timeline-list {
    list-style: none;
    margin: 0;
    padding: 0;
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

    .cta {
      justify-content: center;
    }
  }
</style>
