<script lang="ts">
  import type { Photo } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    photos: Photo[];
  }

  let { photos }: Props = $props();

  let currentIndex = $state(0);

  const current = $derived(photos[currentIndex]);
  const currentImage = $derived(populated(current?.image));

  function goTo(index: number) {
    currentIndex = (index + photos.length) % photos.length;
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') next();
    else if (event.key === 'ArrowLeft') prev();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="carousel">
  <div class="stage">
    <div class="image-wrap">
      {#if photos.length > 1}
        <button type="button" class="nav prev" onclick={prev} aria-label="Previous photo">‹</button>
      {/if}

      {#key current?.id}
        <img
          src={currentImage?.url}
          alt={currentImage?.altText ?? ''}
          class="main-image"
        />
      {/key}

      {#if photos.length > 1}
        <button type="button" class="nav next" onclick={next} aria-label="Next photo">›</button>
      {/if}
    </div>

    <div class="caption-panel">
      <p class="counter">{currentIndex + 1} / {photos.length}</p>
      {#if current?.caption}
        <p class="caption">{current.caption}</p>
      {:else}
        <p class="caption muted">No description for this photo.</p>
      {/if}
    </div>
  </div>

  {#if photos.length > 1}
    <div class="thumbnails" role="tablist" aria-label="Photos in this album">
      {#each photos as photo, index (photo.id)}
        {@const image = populated(photo.image)}
        <button
          type="button"
          class="thumb"
          class:active={index === currentIndex}
          role="tab"
          aria-selected={index === currentIndex}
          aria-label={`Photo ${index + 1}`}
          onclick={() => goTo(index)}
        >
          {#if image}
            <img src={image.url} alt="" loading="lazy" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .carousel {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .stage {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  @media (min-width: 768px) {
    .stage {
      grid-template-columns: 1fr 320px;
      align-items: start;
    }
  }

  .image-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    min-height: 320px;
  }

  .main-image {
    max-width: 100%;
    max-height: min(70vh, 640px);
    width: 100%;
    height: min(70vh, 640px);
    object-fit: contain;
    transition: opacity var(--duration-base) var(--easing-standard);
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    font-size: var(--font-size-xl);
    line-height: 1;
    color: var(--color-text-primary);
    transition: border-color var(--duration-base) var(--easing-standard);
  }

  .nav:hover,
  .nav:focus-visible {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .nav.prev {
    left: var(--space-4);
  }

  .nav.next {
    right: var(--space-4);
  }

  .caption-panel {
    padding-block: var(--space-2);
  }

  .counter {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-3);
  }

  .caption {
    margin: 0;
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
  }

  .caption.muted {
    color: var(--color-text-secondary);
    font-style: italic;
  }

  .thumbnails {
    display: flex;
    gap: var(--space-3);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: var(--space-2);
  }

  .thumb {
    flex-shrink: 0;
    scroll-snap-align: center;
    width: 88px;
    aspect-ratio: 4 / 3;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    padding: 0;
    background: var(--color-surface);
    transition: border-color var(--duration-base) var(--easing-standard);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb:hover {
    border-color: var(--color-accent);
  }

  .thumb.active {
    border-color: var(--color-accent);
  }
</style>
