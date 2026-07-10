<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte.js';
</script>

<div class="toast-stack" role="status" aria-live="polite">
  {#each toastStore.all as toast (toast.id)}
    <div class="toast {toast.variant}">
      <span>{toast.text}</span>
      <button type="button" onclick={() => toastStore.dismiss(toast.id)} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-stack {
    position: fixed;
    bottom: var(--space-5);
    right: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    z-index: 1000;
    max-width: min(360px, calc(100vw - var(--space-6)));
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-size: var(--font-size-sm);
    animation: rise-in var(--duration-base) var(--easing-standard);
  }

  .toast.success {
    background: var(--color-success-subtle);
    color: var(--color-success);
  }
  .toast.error {
    background: var(--color-danger-subtle);
    color: var(--color-danger);
  }
  .toast.info {
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
  }

  .toast button {
    background: none;
    border: none;
    color: inherit;
    font-size: var(--font-size-lg);
    line-height: 1;
    padding: 0;
  }
</style>
