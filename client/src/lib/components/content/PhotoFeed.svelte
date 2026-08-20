<script lang="ts">
  import type { Photo } from '@portfolio/shared';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    photos: Photo[];
  }

  let { photos }: Props = $props();
</script>

<div class="feed">
  {#each photos as photo, index (photo.id)}
    {@const image = populated(photo.image)}
    <figure class="photo">
      {#if image}
        <img src={image.url} alt={image.altText} loading={index === 0 ? 'eager' : 'lazy'} />
      {/if}
    </figure>

    {#if index < photos.length - 1}
      <div class="divider" aria-hidden="true">
        <div class="blur-blob"></div>
        <svg class="wave wave-top" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L0,25 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,0 Z" />
        </svg>
        <svg class="wave wave-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,120 L0,95 C240,65 480,115 720,90 C960,65 1200,115 1440,90 L1440,120 Z" />
        </svg>
      </div>
    {/if}
  {/each}
</div>

<style>
  .feed {
    display: flex;
    flex-direction: column;
  }

  .photo {
    position: relative;
    margin: 0;
    width: 100%;
    height: 100svh;
    max-height: 100vh;
    overflow: hidden;
    background: var(--color-text-primary);
  }

  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .divider {
    position: relative;
    height: 140px;
    overflow: hidden;
    background: var(--color-bg);
  }

  .blur-blob {
    position: absolute;
    inset: -60px;
    background:
      radial-gradient(ellipse 40% 60% at 20% 40%, var(--color-pastel-blue), transparent 65%),
      radial-gradient(ellipse 40% 60% at 55% 60%, var(--color-pastel-rose), transparent 65%),
      radial-gradient(ellipse 40% 60% at 85% 35%, var(--color-pastel-amber), transparent 65%);
    filter: blur(48px);
    opacity: 0.9;
  }

  .wave {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .wave path {
    fill: var(--color-bg);
  }

  .wave-top {
    top: -1px;
  }

  .wave-bottom {
    bottom: -1px;
  }

  @media (min-width: 768px) {
    .divider {
      height: 180px;
    }
  }
</style>
