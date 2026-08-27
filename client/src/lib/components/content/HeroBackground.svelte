<script lang="ts">
  import type { BackgroundMedia } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    background: BackgroundMedia | undefined;
  }

  let { background }: Props = $props();

  const media = $derived(populated(background?.media));
  const isActive = $derived(!!background && background.type !== 'none' && !!media);
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
</script>

{#if isActive && media}
  <div class="fixed-background" aria-hidden="true">
    {#if background?.type === 'video'}
      <video class="bg-media" src={media.url} autoplay={!prefersReducedMotion} muted loop playsinline></video>
    {:else}
      <img class="bg-media" src={media.url} alt="" />
    {/if}
    <div class="scrim"></div>
  </div>
{/if}

<style>
  /* Pinned behind the whole page (including the top bar) for as long as this
     page is mounted — page content scrolls in the normal document flow on
     top of it, the top bar stays transparent the whole time (see Nav.svelte). */
  .fixed-background {
    position: fixed;
    inset: 0;
    z-index: -1;
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
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  }
</style>
