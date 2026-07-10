<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    id: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: Snippet;
  }

  let { label, id, hint, error, required = false, children }: Props = $props();
</script>

<div class="form-field">
  <label for={id}>
    {label}
    {#if required}<span class="required" aria-hidden="true">*</span>{/if}
  </label>
  {@render children()}
  {#if hint && !error}
    <p class="hint">{hint}</p>
  {/if}
  {#if error}
    <p class="error" role="alert">{error}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
  }

  label {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
  }

  .required {
    color: var(--color-accent);
    margin-left: var(--space-1);
  }

  .hint {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .error {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--color-danger);
  }

  .form-field :global(input),
  .form-field :global(textarea),
  .form-field :global(select) {
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    font-family: inherit;
  }

  .form-field :global(input:focus-visible),
  .form-field :global(textarea:focus-visible),
  .form-field :global(select:focus-visible) {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }
</style>
