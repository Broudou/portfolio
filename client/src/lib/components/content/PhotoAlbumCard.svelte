<script lang="ts">
  import type { Album } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    album: Album;
  }

  let { album }: Props = $props();
  const cover = $derived(populated(album.cover));
</script>

<a href="/photos/{album.slug}" class="card pastel-none interactive" class:no-cover={!cover}>
  {#if cover}
    <img src={cover.url} alt={cover.altText} class="cover" loading="lazy" width="1600" height="900" />
  {/if}
  <div class="scrim"></div>
  <div class="content">
    <h3>{album.title}</h3>
  </div>
</a>

<style>
  .card {
    position: relative;
    display: block;
    isolation: isolate;
    overflow: hidden;
    aspect-ratio: 16 / 9;
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
    transform: scale(1);
    transition: transform var(--duration-slow) var(--easing-standard);
  }

  .interactive:hover .cover,
  .interactive:focus-visible .cover {
    transform: scale(1.05);
  }

  .scrim {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(to top, rgba(28, 25, 23, 0.65), rgba(28, 25, 23, 0.05) 45%, transparent 70%);
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    padding: var(--space-5);
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-lg);
    color: var(--color-text-inverse);
  }
</style>
