<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import TimelineItem from '$lib/components/content/TimelineItem.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(
      siteUrl,
      '/timeline',
      data.settings.seoDefaults,
      undefined,
      'Timeline',
      'Career milestones, projects, and achievements over time.',
    ),
  );
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  <header class="page-header">
    <h1>Timeline</h1>
    <p>Career milestones, projects, and achievements — most recent first.</p>
  </header>

  {#if data.events.length === 0}
    <EmptyState title="Nothing here yet" />
  {:else}
    <ul class="timeline-list">
      {#each data.events as event (event.id)}
        <TimelineItem {event} />
      {/each}
    </ul>
  {/if}
</div>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .page-header {
    max-width: var(--prose-max-width);
    margin-bottom: var(--space-7);
  }

  .page-header p {
    color: var(--color-text-secondary);
  }

  .timeline-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: var(--prose-max-width);
  }
</style>
