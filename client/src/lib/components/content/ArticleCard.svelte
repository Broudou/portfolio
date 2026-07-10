<script lang="ts">
  import type { Article } from '@portfolio/shared';
  import Card from '$lib/components/ui/Card.svelte';
  import { populated } from '$lib/utils/populated.js';
  import { formatDate } from '$lib/utils/date.js';
  import { formatReadingTime } from '$lib/utils/readingTime.js';

  interface Props {
    article: Article;
  }

  let { article }: Props = $props();
  const cover = $derived(populated(article.coverImage));
  const category = $derived(populated(article.category));
</script>

<Card href="/articles/{article.slug}">
  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1200" height="800" />
  {/if}
  <p class="meta">
    {#if category}<span>{category.name}</span> · {/if}
    <time datetime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
    · {formatReadingTime(article.readingTimeMinutes)}
  </p>
  <h3>{article.title}</h3>
  <p class="excerpt">{article.excerpt}</p>
</Card>

<style>
  .cover {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
  }

  .meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  h3 {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-lg);
  }

  .excerpt {
    color: var(--color-text-secondary);
    margin: 0;
  }
</style>
