<script lang="ts">
  import { safeJsonLdString } from '$lib/utils/jsonld.js';

  interface Props {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImageUrl?: string;
    twitterHandle?: string;
    type?: 'website' | 'article' | 'profile';
    jsonLd?: unknown | unknown[];
  }

  let { title, description, canonicalUrl, ogImageUrl, twitterHandle, type = 'website', jsonLd }: Props =
    $props();

  const jsonLdBlocks = $derived(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  {#if ogImageUrl}
    <meta property="og:image" content={ogImageUrl} />
  {/if}

  <meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
  {#if twitterHandle}
    <meta name="twitter:site" content={twitterHandle} />
  {/if}
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if ogImageUrl}
    <meta name="twitter:image" content={ogImageUrl} />
  {/if}

  {#each jsonLdBlocks as block (block)}
    {@html `<script type="application/ld+json">${safeJsonLdString(block)}<\/script>`}
  {/each}
</svelte:head>
