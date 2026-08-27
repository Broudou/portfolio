<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Photo } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';
  import type SwiperInstance from 'swiper';
  import 'swiper/css';
  import 'swiper/css/effect-fade';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  interface Props {
    photos: Photo[];
    /** Fill the parent's height instead of sizing itself from a 16:9 aspect-ratio. */
    fill?: boolean;
  }

  let { photos, fill = false }: Props = $props();

  const images = $derived(
    photos.map((photo) => populated(photo.image)).filter((image) => image !== null),
  );

  let container: HTMLElement | undefined = $state();
  let swiper: SwiperInstance | undefined;

  onMount(async () => {
    if (images.length === 0 || !container) return;
    const { default: Swiper } = await import('swiper');
    const { EffectFade, Navigation, Pagination, Keyboard } = await import('swiper/modules');

    swiper = new Swiper(container, {
      modules: [EffectFade, Navigation, Pagination, Keyboard],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: images.length > 1,
      keyboard: { enabled: true },
      navigation:
        images.length > 1
          ? { nextEl: '.carousel-next', prevEl: '.carousel-prev' }
          : false,
      pagination: images.length > 1 ? { el: '.carousel-pagination', clickable: true } : false,
    });
  });

  onDestroy(() => {
    swiper?.destroy(true, true);
  });
</script>

{#if images.length > 0}
  <div class="carousel" class:fill>
    <div class="swiper" class:fill bind:this={container} aria-label="Photo carousel">
      <div class="swiper-wrapper">
        {#each images as image, index (image.id)}
          <div class="swiper-slide">
            <img
              src={image.url}
              alt={image.altText}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        {/each}
      </div>

      {#if images.length > 1}
        <button type="button" class="carousel-nav carousel-prev" aria-label="Previous photo">‹</button>
        <button type="button" class="carousel-nav carousel-next" aria-label="Next photo">›</button>
        <div class="carousel-pagination"></div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .carousel.fill {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    container-type: size;
  }

  .swiper {
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
    background: var(--color-surface);
  }

  /* Keeps the 16:9 crop at whatever size fits inside the available box —
     bound by width on short/wide viewports, by height on tall/narrow ones
     (mobile portrait included) — rather than stretching to fill it.
     !important: Swiper's own JS measures and sometimes sets an inline height
     on this element — a plain override here can lose to that inline style. */
  .swiper.fill {
    aspect-ratio: 16 / 9 !important;
    width: min(100cqw, calc(100cqh * 16 / 9)) !important;
    height: min(100cqh, calc(100cqw * 9 / 16)) !important;
  }

  :global(.swiper-slide) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
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

  .carousel-nav:hover,
  .carousel-nav:focus-visible {
    background: rgba(0, 0, 0, 0.75);
  }

  .carousel-prev {
    left: var(--space-3);
  }

  .carousel-next {
    right: var(--space-3);
  }

  .carousel-pagination {
    position: absolute;
    bottom: var(--space-3);
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    gap: var(--space-2);
  }

  :global(.carousel-pagination .swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    background: var(--color-border);
    opacity: 1;
  }

  :global(.carousel-pagination .swiper-pagination-bullet-active) {
    background: var(--color-accent);
  }
</style>
