<script lang="ts">
  import type { Media } from '@portfolio/shared';

  interface Props {
    fullName: string;
    headline: string;
    summary: string;
    avatar?: Media | null;
  }

  let { fullName, headline, summary, avatar = null }: Props = $props();
</script>

<div class="hero-inner">
  {#if avatar}
    <img src={avatar.url} alt={avatar.altText} class="avatar" width="96" height="96" />
  {:else}
    <div class="avatar avatar-placeholder" aria-hidden="true"></div>
  {/if}
  <div class="hero-text">
    <h1>{fullName}</h1>
    <p class="headline">{headline}</p>
    <p class="summary">{summary}</p>
  </div>
</div>

<style>
  .hero-inner {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .avatar {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  .avatar-placeholder {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .hero-text {
    text-align: left;
  }

  h1 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-1);
  }

  .headline {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .summary {
    max-width: 60ch;
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    .hero-inner {
      flex-direction: column;
      text-align: center;
    }

    .hero-text {
      text-align: center;
    }
  }
</style>
