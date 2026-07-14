<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import ProjectCard from '$lib/components/content/ProjectCard.svelte';
  import TagFilterBar from '$lib/components/content/TagFilterBar.svelte';
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
  <header class="page-header">
    <h1>Projects</h1>
    <p>A selection of systems and tools I've built, from internal platforms to open-source libraries.</p>
  </header>

  <TagFilterBar
    action="/projects"
    categories={data.categories}
    tags={data.tags}
    selectedCategory={data.filters.category}
    selectedTag={data.filters.tag}
  />

  {#if data.projects.length === 0}
    <EmptyState title="No projects found" description="Try clearing the filters above." />
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

  .page-header {
    max-width: var(--prose-max-width);
    margin-bottom: var(--space-7);
  }

  .page-header p {
    color: var(--color-text-secondary);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }
</style>
