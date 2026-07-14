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

<a href="/articles/{article.slug}" class="card pastel-none interactive">
  <div class="content">
    <p class="meta">
      {#if category}<span>{category.name}</span> · {/if}
      <time datetime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
      · {formatReadingTime(article.readingTimeMinutes)}
    </p>
    <h3>{article.title}</h3>
    <p class="excerpt">{article.excerpt}</p>
  </div>
  {#if cover}
    <div class="image-pane">
      <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1200" height="800" />
    </div>
  {/if}
</a>

<style>
  .card {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    text-decoration: none;
    color: inherit;
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

  .content {
    flex: 1 1 50%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--space-3) var(--space-5);
  }

  .image-pane {
    position: relative;
    flex: 0 0 50%;
    overflow: hidden;
  }

  .cover {
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

  .meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  h3 {
    margin-bottom: var(--space-1);
    font-size: var(--font-size-lg);
  }

  .excerpt {
    color: var(--color-text-secondary);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 640px) {
    .image-pane {
      display: none;
    }

    .content {
      flex-basis: 100%;
    }
  }
</style>
