<script lang="ts">
  import type { Article } from '@portfolio/shared';

  interface Props {
    article: Article;
  }

  let { article }: Props = $props();
</script>

<a href="/articles/{article.slug}" class="article-row">
  <h3>{article.title}</h3>
  <p class="excerpt">{article.excerpt}</p>
</a>

<style>
  .article-row {
    display: block;
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
    text-decoration: none;
    color: inherit;
    transition: color var(--duration-base) var(--easing-standard);
  }

  .article-row:first-child {
    padding-top: 0;
  }

  .article-row:last-child {
    border-bottom: none;
  }

  .article-row:hover h3,
  .article-row:focus-visible h3 {
    color: var(--color-accent);
  }

  h3 {
    margin: 0 0 var(--space-2);
    font-size: var(--font-size-lg);
  }

  .excerpt {
    margin: 0;
    color: var(--color-text-secondary);
  }
</style>
