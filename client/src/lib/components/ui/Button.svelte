<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
  }

  let {
    href,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    onclick,
    children,
  }: Props = $props();
</script>

{#if href}
  <a {href} class="btn {variant} {size}" aria-disabled={disabled || undefined}>{@render children()}</a>
{:else}
  <button {type} class="btn {variant} {size}" {disabled} {onclick}>
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background-color var(--duration-base) var(--easing-standard),
      color var(--duration-base) var(--easing-standard),
      border-color var(--duration-base) var(--easing-standard);
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    opacity: 0.5;
    pointer-events: none;
  }

  .md {
    padding: var(--space-3) var(--space-5);
    font-size: var(--font-size-base);
  }

  .sm {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }

  .primary {
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
  }
  .primary:hover {
    background: var(--color-accent);
  }

  .secondary {
    background: transparent;
    color: var(--color-text-primary);
    border-color: var(--color-text-primary);
  }
  .secondary:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .ghost {
    background: transparent;
    color: var(--color-text-primary);
  }
  .ghost:hover {
    color: var(--color-accent);
  }

  .danger {
    background: var(--color-danger);
    color: var(--color-text-inverse);
  }
  .danger:hover {
    background: #991b1b;
  }
</style>
