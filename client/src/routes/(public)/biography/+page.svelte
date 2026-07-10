<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
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

<article class="container page">
  <header class="page-header">
    {#if avatar}
      <img src={avatar.url} alt={avatar.altText} class="avatar" width="140" height="140" />
    {/if}
    <div>
      <h1>{data.biography.fullName}</h1>
      <p class="headline">{data.biography.headline}</p>
      {#if data.biography.location}
        <p class="location">{data.biography.location}</p>
      {/if}
    </div>
  </header>

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

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    margin-bottom: var(--space-6);
  }

  .avatar {
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  .headline {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-1);
  }

  .location {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
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
