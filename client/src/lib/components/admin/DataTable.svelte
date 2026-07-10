<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    caption: string;
    children: Snippet;
  }

  let { caption, children }: Props = $props();
</script>

<div class="table-wrap">
  <table>
    <caption class="visually-hidden">{caption}</caption>
    {@render children()}
  </table>
</div>

<style>
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  table :global(th),
  table :global(td) {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
  }

  table :global(thead th) {
    background: var(--color-surface);
    font-weight: var(--font-weight-semibold);
  }

  table :global(tbody tr:last-child td) {
    border-bottom: none;
  }

  table :global(tbody tr:hover) {
    background: var(--color-surface);
  }

  table :global(.row-actions) {
    display: flex;
    gap: var(--space-3);
  }
</style>
