<script lang="ts">
  import type { Album } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    album: Album;
  }

  let { album }: Props = $props();
  const cover = $derived(populated(album.cover));
</script>

<a href="/photos/{album.slug}" class="album-row">
  <div class="thumb">
    {#if cover}
      <img src={cover.url} alt={cover.altText} loading="lazy" />
    {/if}
  </div>
  <div class="text">
    <h3>{album.title}</h3>
    {#if album.description}
      <p class="description">{album.description}</p>
    {/if}
  </div>
</a>

<style>
  .album-row {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    padding-block: var(--space-5);
    border-bottom: 1px solid var(--color-border);
    text-decoration: none;
    color: inherit;
  }

  .album-row:first-child {
    padding-top: 0;
  }

  .album-row:last-child {
    border-bottom: none;
  }

  .album-row:hover h3,
  .album-row:focus-visible h3 {
    color: var(--color-accent);
  }

  .thumb {
    flex-shrink: 0;
    width: 96px;
    aspect-ratio: 4 / 3;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--color-surface);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text {
    min-width: 0;
  }

  h3 {
    margin: 0 0 var(--space-2);
    font-size: var(--font-size-lg);
    transition: color var(--duration-base) var(--easing-standard);
  }

  .description {
    margin: 0;
    color: var(--color-text-secondary);
  }
</style>
