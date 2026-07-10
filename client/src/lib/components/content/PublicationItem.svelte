<script lang="ts">
  import type { Publication } from '@portfolio/shared';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { formatDate } from '$lib/utils/date.js';

  interface Props {
    publication: Publication;
  }

  let { publication }: Props = $props();

  const TYPE_LABEL: Record<string, string> = {
    talk: 'Talk',
    publication: 'Publication',
    podcast: 'Podcast',
    workshop: 'Workshop',
  };
</script>

<article class="publication">
  <div class="heading">
    <Badge variant="accent">{TYPE_LABEL[publication.type] ?? publication.type}</Badge>
    <time datetime={publication.date} class="date">{formatDate(publication.date)}</time>
  </div>
  <h3>
    {#if publication.url}
      <a href={publication.url} target="_blank" rel="noopener noreferrer">{publication.title}</a>
    {:else}
      {publication.title}
    {/if}
  </h3>
  <p class="venue">{publication.venue}{#if publication.coAuthors.length > 0} · with {publication.coAuthors.join(', ')}{/if}</p>
  {#if publication.description}
    <p class="description">{publication.description}</p>
  {/if}
  {#if publication.slidesUrl}
    <a href={publication.slidesUrl} target="_blank" rel="noopener noreferrer" class="slides">Slides →</a>
  {/if}
</article>

<style>
  .publication {
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .heading {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .date {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  h3 {
    margin: 0 0 var(--space-1);
    font-size: var(--font-size-lg);
  }

  h3 a {
    color: var(--color-text-primary);
    text-decoration: none;
  }
  h3 a:hover {
    color: var(--color-accent);
  }

  .venue {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
  }

  .description {
    margin-bottom: var(--space-2);
  }
</style>
