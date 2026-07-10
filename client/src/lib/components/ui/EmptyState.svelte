<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    action?: Snippet;
  }

  let { title, description, action }: Props = $props();
</script>

<div class="empty-state">
  <h3>{title}</h3>
  {#if description}
    <p>{description}</p>
  {/if}
  {#if action}
    <div class="action">{@render action()}</div>
  {/if}
</div>

<style>
  .empty-state {
    text-align: center;
    padding: var(--space-8) var(--space-5);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-text-secondary);
  }

  .empty-state h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--space-2);
  }

  .empty-state p {
    margin-bottom: var(--space-5);
  }

  .action {
    display: flex;
    justify-content: center;
  }
</style>
