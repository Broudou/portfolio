<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Photo } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';
  import '@splidejs/splide/css/core';

  interface Props {
    photos: Photo[];
  }

  let { photos }: Props = $props();

  const images = $derived(
    photos.map((photo) => populated(photo.image)).filter((image) => image !== null),
  );

  let track: HTMLElement | undefined = $state();
  let splide: import('@splidejs/splide').Splide | undefined;

  onMount(async () => {
    if (images.length === 0 || !track) return;
    const { Splide } = await import('@splidejs/splide');
    splide = new Splide(track, {
      type: images.length > 1 ? 'loop' : 'slide',
      arrows: images.length > 1,
      pagination: images.length > 1,
      keyboard: 'global',
      lazyLoad: 'nearby',
    });
    splide.mount();
  });

  onDestroy(() => {
    splide?.destroy();
  });
</script>

{#if images.length > 0}
  <div class="carousel">
    <div class="splide" bind:this={track} aria-label="Photo carousel">
      <div class="splide__track">
        <ul class="splide__list">
          {#each images as image, index (image.id)}
            <li class="splide__slide">
              <img
                src={image.url}
                alt={image.altText}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
  .carousel {
    max-width: var(--prose-max-width);
  }

  .splide {
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  :global(.splide__slide) {
    aspect-ratio: 16 / 9;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-surface);
  }

  :global(.splide__slide) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :global(.splide__arrow) {
    background: rgba(0, 0, 0, 0.5);
  }

  :global(.splide__arrow:hover) {
    background: rgba(0, 0, 0, 0.75);
  }

  :global(.splide__arrow svg) {
    fill: var(--color-text-inverse);
  }

  :global(.splide__pagination__page.is-active) {
    background: var(--color-accent);
  }
</style>
