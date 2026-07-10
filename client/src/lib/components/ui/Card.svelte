<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    pastel?: 'blue' | 'green' | 'amber' | 'rose' | 'violet' | 'none';
    children: Snippet;
  }

  let { href, pastel = 'none', children }: Props = $props();
</script>

{#if href}
  <a {href} class="card pastel-{pastel} interactive">{@render children()}</a>
{:else}
  <div class="card pastel-{pastel}">{@render children()}</div>
{/if}

<style>
  .card {
    display: block;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    padding: var(--space-5);
    text-decoration: none;
    color: inherit;
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

  .pastel-blue {
    background: var(--color-pastel-blue);
  }
  .pastel-green {
    background: var(--color-pastel-green);
  }
  .pastel-amber {
    background: var(--color-pastel-amber);
  }
  .pastel-rose {
    background: var(--color-pastel-rose);
  }
  .pastel-violet {
    background: var(--color-pastel-violet);
  }
</style>
