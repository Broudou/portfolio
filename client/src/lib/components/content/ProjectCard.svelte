<script lang="ts">
  import type { Project } from '@portfolio/shared';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();
  const cover = $derived(populated(project.coverImage));
</script>

<Card href="/projects/{project.slug}">
  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1200" height="800" />
  {/if}
  <h3>{project.title}</h3>
  <p class="summary">{project.summary}</p>
  {#if project.techStack.length > 0}
    <ul class="tech-stack">
      {#each project.techStack.slice(0, 4) as tech (tech)}
        <li><Badge variant="neutral">{tech}</Badge></li>
      {/each}
    </ul>
  {/if}
</Card>

<style>
  .cover {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
  }

  h3 {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-lg);
  }

  .summary {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
