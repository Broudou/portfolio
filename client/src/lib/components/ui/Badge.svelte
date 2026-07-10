<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'accent' | 'neutral' | 'success' | 'warning' | 'danger';
    children: Snippet;
  }

  let { variant = 'neutral', children }: Props = $props();
</script>

<span class="badge {variant}">{@render children()}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
    white-space: nowrap;
  }

  .accent {
    background: var(--color-accent-subtle);
    color: var(--color-accent-hover);
  }

  .neutral {
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .success {
    background: var(--color-success-subtle);
    color: var(--color-success);
  }

  .warning {
    background: var(--color-warning-subtle);
    color: var(--color-warning);
  }

  .danger {
    background: var(--color-danger-subtle);
    color: var(--color-danger);
  }
</style>
