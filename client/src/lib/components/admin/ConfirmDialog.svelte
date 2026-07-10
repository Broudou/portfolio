<script lang="ts">
  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onconfirm: () => void;
    oncancel: () => void;
  }

  let { open, title, message, confirmLabel = 'Delete', onconfirm, oncancel }: Props = $props();
  let dialogEl: HTMLDialogElement;

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) dialogEl.showModal();
    if (!open && dialogEl.open) dialogEl.close();
  });
</script>

<dialog bind:this={dialogEl} onclose={oncancel} class="confirm-dialog">
  <h2>{title}</h2>
  <p>{message}</p>
  <div class="actions">
    <button type="button" class="cancel" onclick={oncancel}>Cancel</button>
    <button type="button" class="confirm" onclick={onconfirm}>{confirmLabel}</button>
  </div>
</dialog>

<style>
  .confirm-dialog {
    border: none;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-6);
    max-width: 420px;
    width: calc(100vw - var(--space-6));
  }

  .confirm-dialog::backdrop {
    background: rgba(28, 25, 23, 0.4);
  }

  .confirm-dialog h2 {
    margin-bottom: var(--space-3);
    font-size: var(--font-size-lg);
  }

  .confirm-dialog p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
  }

  .cancel,
  .confirm {
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .confirm {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: var(--color-text-inverse);
  }
</style>
