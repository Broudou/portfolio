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
    {#if image}
      <figure class="photo">
        <img src={image.url} alt={image.altText} loading={index === 0 ? 'eager' : 'lazy'} />
      </figure>
    {/if}
  {/each}
</div>

<style>
  .feed {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .photo {
    margin: 0;
  }

  .photo img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }
</style>
