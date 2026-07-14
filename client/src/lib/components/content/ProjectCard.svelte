<script lang="ts">
  import type { Project } from '@portfolio/shared';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();
  const cover = $derived(populated(project.coverImage));
</script>

<a href="/projects/{project.slug}" class="card pastel-none interactive" class:no-cover={!cover}>
  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1200" height="800" />
  {/if}
  <div class="scrim"></div>
  <div class="content">
    <h3>{project.title}</h3>
    <p class="summary">{project.summary}</p>
    {#if project.techStack.length > 0}
      <ul class="tech-stack">
        {#each project.techStack.slice(0, 4) as tech (tech)}
          <li><Badge variant="neutral">{tech}</Badge></li>
        {/each}
      </ul>
    {/if}
  </div>
</a>

<style>
  .card {
    position: relative;
    display: block;
    isolation: isolate;
    overflow: hidden;
    min-height: 240px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    text-decoration: none;
    transition:
      transform var(--duration-base) var(--easing-standard),
      box-shadow var(--duration-base) var(--easing-standard),
      border-color var(--duration-base) var(--easing-standard);
  }

  .interactive:hover,
  .interactive:focus-visible {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-accent);
  }

  .no-cover {
    background: var(--color-text-primary);
  }

  .cover {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1);
    transform: scale(1);
    transition:
      filter var(--duration-slow) var(--easing-standard),
      transform var(--duration-slow) var(--easing-standard);
  }

  .interactive:hover .cover,
  .interactive:focus-visible .cover {
    filter: grayscale(0);
    transform: scale(1.05);
  }

  .scrim {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(to top, rgba(28, 25, 23, 0.85), rgba(28, 25, 23, 0.25) 60%, rgba(28, 25, 23, 0.1));
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    min-height: 240px;
    padding: var(--space-5);
  }

  h3 {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-lg);
    color: var(--color-text-inverse);
  }

  .summary {
    color: var(--color-text-inverse);
    opacity: 0.85;
    margin-bottom: var(--space-4);
    max-width: 60ch;
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
