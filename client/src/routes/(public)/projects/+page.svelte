<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import ProjectCard from '$lib/components/content/ProjectCard.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(siteUrl, '/projects', data.settings.seoDefaults, undefined, 'Projects', 'A selection of engineering projects.'),
  );

  function buildHref(pageNum: number): string {
    const params = new URLSearchParams();
    if (data.filters.category) params.set('category', data.filters.category);
    if (data.filters.tag) params.set('tag', data.filters.tag);
    params.set('page', String(pageNum));
    return `/projects?${params.toString()}`;
  }
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  {#if data.projects.length === 0}
    <EmptyState title="No projects found" description="Check back soon for new projects." />
  {:else}
    <div class="list">
      {#each data.projects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
    <Pagination meta={data.meta} {buildHref} />
  {/if}
</div>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
  }

  @media (max-width: 1024px) {
    .list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .list {
      grid-template-columns: 1fr;
    }
  }
</style>
