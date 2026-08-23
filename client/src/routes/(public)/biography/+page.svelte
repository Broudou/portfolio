<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import Hero from '$lib/components/content/Hero.svelte';
  import HeroBackground from '$lib/components/content/HeroBackground.svelte';
  import MarkdownRenderer from '$lib/components/content/MarkdownRenderer.svelte';
  import { populated } from '$lib/utils/populated.js';
  import { resolveSeo } from '$lib/utils/seo.js';
  import { personJsonLd } from '$lib/utils/jsonld.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const avatar = $derived(populated(data.biography.avatar));
  const hasBackground = data.hasHeroBackground;
  const seo = $derived(
    resolveSeo(
      siteUrl,
      '/biography',
      data.settings.seoDefaults,
      data.biography.seo,
      `${data.biography.fullName} — Biography`,
      data.biography.summary,
    ),
  );
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  canonicalUrl={seo.canonicalUrl}
  ogImageUrl={seo.ogImageUrl}
  twitterHandle={seo.twitterHandle}
  type="profile"
  jsonLd={personJsonLd(siteUrl, data.biography, avatar?.url)}
/>

{#if hasBackground}
  <HeroBackground background={data.biography.background} />
{/if}

<div class="hero-section container">
  <div class="hero-wrap">
    <Hero
      fullName={data.biography.fullName}
      headline={data.biography.headline}
      summary={data.biography.summary}
      {avatar}
      variant={hasBackground ? 'overlay' : 'default'}
    />
    {#if data.biography.location}
      <p class="location" class:overlay={hasBackground}>{data.biography.location}</p>
    {/if}
  </div>
</div>

<div class="page">
  <article class="container">
    {#if data.biography.skills.length > 0}
      <ul class="skills">
        {#each data.biography.skills as skill (skill)}
          <li>{skill}</li>
        {/each}
      </ul>
    {/if}

    <MarkdownRenderer html={data.bioHtml} />

    {#if data.biography.highlights.length > 0}
      <section class="highlights">
        <h2>Highlights</h2>
        <ul>
          {#each data.biography.highlights as highlight (highlight)}
            <li>{highlight}</li>
          {/each}
        </ul>
      </section>
    {/if}
  </article>
</div>

<style>
  /* Sits directly over the fixed background (when active) — no opaque
     background of its own, unlike `.page` below. */
  .hero-section {
    padding-block: var(--space-8) var(--space-6);
  }

  .page {
    padding-block: 0 var(--space-9);
    background: var(--color-bg);
  }

  .location {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin: var(--space-2) 0 0;
  }

  .location.overlay {
    color: inherit;
    opacity: 0.9;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: 0 0 var(--space-7);
    padding: 0;
  }

  .skills li {
    background: var(--color-pastel-blue);
    color: var(--color-text-primary);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }

  .highlights {
    margin-top: var(--space-7);
    max-width: var(--prose-max-width);
  }
</style>
