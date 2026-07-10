<script lang="ts">
  import { renderMarkdown } from '$lib/utils/markdown.js';

  interface Props {
    value: string;
    id: string;
    label: string;
    rows?: number;
    required?: boolean;
  }

  let { value = $bindable(), id, label, rows = 18, required = false }: Props = $props();

  let mode = $state<'write' | 'preview'>('write');
  let previewHtml = $state('');
  let renderToken = 0;

  $effect(() => {
    if (mode !== 'preview') return;
    const token = ++renderToken;
    renderMarkdown(value).then((html) => {
      if (token === renderToken) previewHtml = html;
    });
  });
</script>

<div class="markdown-editor">
  <div class="toolbar">
    <label for={id}>
      {label}
      {#if required}<span class="required" aria-hidden="true">*</span>{/if}
    </label>
    <div class="tabs" role="tablist" aria-label="Markdown editor mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'write'}
        onclick={() => (mode = 'write')}
      >
        Write
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'preview'}
        onclick={() => (mode = 'preview')}
      >
        Preview
      </button>
    </div>
  </div>

  {#if mode === 'write'}
    <textarea {id} bind:value {rows} spellcheck="true"></textarea>
  {:else}
    <div class="preview prose" role="tabpanel">
      {#if value.trim()}
        {@html previewHtml}
      {:else}
        <p class="empty">Nothing to preview yet.</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .markdown-editor {
    margin-bottom: var(--space-5);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  label {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
  }

  .required {
    color: var(--color-accent);
    margin-left: var(--space-1);
  }

  .tabs {
    display: flex;
    gap: var(--space-1);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    padding: 2px;
  }

  .tabs button {
    background: none;
    border: none;
    padding: var(--space-1) var(--space-4);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  .tabs button[aria-selected='true'] {
    background: var(--color-bg);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-sm);
  }

  textarea {
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    resize: vertical;
  }

  .preview {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    min-height: 200px;
    max-width: none;
  }

  .empty {
    color: var(--color-text-secondary);
  }
</style>
