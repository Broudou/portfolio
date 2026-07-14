<script lang="ts">
  import type { Article } from '@portfolio/shared';
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

<a href="/articles/{article.slug}" class="card pastel-none interactive" class:no-cover={!cover}>
  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1200" height="800" />
  {/if}
  <div class="scrim"></div>
  <div class="content">
    <p class="meta">
      {#if category}<span>{category.name}</span> · {/if}
      <time datetime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
      · {formatReadingTime(article.readingTimeMinutes)}
    </p>
    <h3>{article.title}</h3>
    <p class="excerpt">{article.excerpt}</p>
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

  .meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-inverse);
    opacity: 0.85;
    margin-bottom: var(--space-2);
  }

  h3 {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-lg);
    color: var(--color-text-inverse);
  }

  .excerpt {
    color: var(--color-text-inverse);
    opacity: 0.85;
    margin: 0;
    max-width: 60ch;
  }
</style>
