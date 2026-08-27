<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
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
  <div class="hero-section container">
    <h1>{data.biography.fullName}</h1>
    <p>{data.biography.headline}</p>
  </div>
{/if}

<div class="page">
  <article class="container">
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
  .hero-section {
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

  .hero-section h1 {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-3);
  }

  .hero-section p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    margin: 0;
  }

  .page {
    padding-block: 0 var(--space-9);
    background: var(--color-bg);
  }

  /* Fill the section width like the home page's content, rather than
     capping to the narrower prose reading column. */
  .page :global(.prose) {
    max-width: none;
  }

  .highlights {
    margin-top: var(--space-7);
  }
</style>
