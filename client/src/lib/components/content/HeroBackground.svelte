<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BackgroundMedia } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';
  import { pageChrome } from '$lib/stores/pageChrome.svelte.js';

  interface Props {
    background: BackgroundMedia | undefined;
    children: Snippet;
  }

  let { background, children }: Props = $props();

  const media = $derived(populated(background?.media));
  const isActive = $derived(!!background && background.type !== 'none' && !!media);

  let rootEl: HTMLElement | undefined = $state();
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateTransparency() {
    if (!rootEl) return;
    pageChrome.setNavTransparent(rootEl.getBoundingClientRect().bottom > pageChrome.navHeight);
  }

  $effect(() => {
    if (!isActive) return;

    updateTransparency();

    window.addEventListener('scroll', updateTransparency, { passive: true });
    window.addEventListener('resize', updateTransparency);

    return () => {
      window.removeEventListener('scroll', updateTransparency);
      window.removeEventListener('resize', updateTransparency);
      pageChrome.setNavTransparent(false);
    };
  });
</script>

{#if isActive && media}
  <section class="hero-banner" bind:this={rootEl}>
    {#if background?.type === 'video'}
      <video
        class="bg-media"
        src={media.url}
        autoplay={!prefersReducedMotion}
        muted
        loop
        playsinline
        aria-hidden="true"
      ></video>
    {:else}
      <img class="bg-media" src={media.url} alt="" aria-hidden="true" />
    {/if}
    <div class="scrim" aria-hidden="true"></div>
    <div class="banner-content container">
      {@render children()}
    </div>
  </section>
{:else}
  {@render children()}
{/if}

<style>
  .hero-banner {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .bg-media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.55) 100%);
  }

  .banner-content {
    position: relative;
    z-index: 1;
    color: #ffffff;
  }
</style>
