<script lang="ts">
  import type { Photo } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    photos: Photo[];
  }

  let { photos }: Props = $props();

  let currentIndex = $state(0);

  const images = $derived(
    photos.map((photo) => populated(photo.image)).filter((image) => image !== null),
  );

  function goTo(index: number) {
    currentIndex = (index + images.length) % images.length;
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') prev();
    else if (event.key === 'ArrowRight') next();
  }
</script>

{#if images.length > 0}
  <div class="carousel">
    <div class="stage" role="group" aria-label="Photo carousel" tabindex="0" onkeydown={handleKeydown}>
      {#each images as image, index (image.id)}
        <img
          src={image.url}
          alt={image.altText}
          class="slide"
          class:active={index === currentIndex}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      {/each}

      {#if images.length > 1}
        <button type="button" class="nav prev" onclick={prev} aria-label="Previous photo">‹</button>
        <button type="button" class="nav next" onclick={next} aria-label="Next photo">›</button>
      {/if}
    </div>

    {#if images.length > 1}
      <div class="dots" role="tablist" aria-label="Photos">
        {#each images as image, index (image.id)}
          <button
            type="button"
            class="dot"
            class:active={index === currentIndex}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Show photo ${index + 1}`}
            onclick={() => goTo(index)}
          ></button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .carousel {
    max-width: var(--prose-max-width);
  }

  .stage {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
    background: var(--color-surface);
  }

  .stage:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity var(--duration-base) var(--easing-standard);
  }

  .slide.active {
    opacity: 1;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-full);
    background: rgba(0, 0, 0, 0.5);
    color: var(--color-text-inverse);
    font-size: var(--font-size-xl);
    line-height: 1;
    cursor: pointer;
    transition: background var(--duration-base) var(--easing-standard);
  }

  .nav:hover,
  .nav:focus-visible {
    background: rgba(0, 0, 0, 0.75);
  }

  .nav.prev {
    left: var(--space-3);
  }

  .nav.next {
    right: var(--space-3);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  .dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border: none;
    border-radius: var(--radius-full);
    background: var(--color-border);
    cursor: pointer;
    transition: background var(--duration-base) var(--easing-standard);
  }

  .dot.active {
    background: var(--color-accent);
  }
</style>
