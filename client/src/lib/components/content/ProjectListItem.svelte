<script lang="ts">
  import type { Project } from '@portfolio/shared';

  interface Props {
    project: Project;
  }

  let { project }: Props = $props();
</script>

<a href="/projects/{project.slug}" class="project-row">
  <h3>{project.title}</h3>
  <p class="summary">{project.summary}</p>
  {#if project.techStack.length > 0}
    <p class="tech-stack">{project.techStack.join(' · ')}</p>
  {/if}
</a>

<style>
  .project-row {
    display: block;
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
    text-decoration: none;
    color: inherit;
    transition: color var(--duration-base) var(--easing-standard);
  }

  .project-row:first-child {
    padding-top: 0;
  }

  .project-row:last-child {
    border-bottom: none;
  }

  .project-row:hover h3,
  .project-row:focus-visible h3 {
    color: var(--color-accent);
  }

  h3 {
    margin: 0 0 var(--space-2);
    font-size: var(--font-size-lg);
  }

  .summary {
    margin: 0 0 var(--space-2);
    color: var(--color-text-secondary);
  }

  .tech-stack {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
</style>
