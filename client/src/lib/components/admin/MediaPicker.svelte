<script lang="ts">
  import type { Media } from '@portfolio/shared';
  import { enhance } from '$app/forms';

  interface Props {
    value: string | null;
    id: string;
    label: string;
    media: Media[];
    accept?: string;
    maxSizeMB?: number;
  }

  let { value = $bindable(), id, label, media, accept = 'image/*', maxSizeMB = 5 }: Props = $props();

  const MAX_FILE_SIZE_BYTES = $derived(maxSizeMB * 1024 * 1024);

  let localMedia = $state<Media[]>(media);
  let dialogEl: HTMLDialogElement;
  let uploading = $state(false);
  let uploadError = $state<string | null>(null);

  const selected = $derived(localMedia.find((item) => item.id === value) ?? null);

  function openPicker() {
    uploadError = null;
    dialogEl.showModal();
  }

  function choose(mediaId: string) {
    value = mediaId;
    dialogEl.close();
  }

  function clearSelection() {
    value = null;
  }

  function handleFileChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      uploadError = `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max size is ${maxSizeMB} MB.`;
      input.value = '';
    } else {
      uploadError = null;
    }
  }
</script>

<div class="media-picker">
  <span id="{id}-label" class="picker-label">{label}</span>
  <input type="hidden" {id} name={id} value={value ?? ''} />

  <div class="preview">
    {#if selected}
      {#if selected.mimeType.startsWith('video/')}
        <video src={selected.url} muted playsinline preload="metadata"></video>
      {:else}
        <img src={selected.url} alt={selected.altText} />
      {/if}
    {:else}
      <div class="placeholder" aria-hidden="true">No file selected</div>
    {/if}
  </div>

  <div class="actions">
    <button type="button" onclick={openPicker} aria-describedby="{id}-label">Choose file</button>
    {#if selected}
      <button type="button" class="ghost" onclick={clearSelection}>Remove</button>
    {/if}
  </div>
</div>

<dialog bind:this={dialogEl} class="picker-dialog" aria-label="Choose a file">
  <h2>Media library</h2>

  <div class="grid">
    {#each localMedia as item (item.id)}
      <button type="button" class="thumb" onclick={() => choose(item.id)}>
        {#if item.mimeType.startsWith('video/')}
          <video src={item.url} muted playsinline preload="metadata"></video>
        {:else}
          <img src={item.url} alt={item.altText} loading="lazy" />
        {/if}
      </button>
    {/each}
  </div>

  <form
    method="POST"
    action="/admin/media?/upload"
    enctype="multipart/form-data"
    use:enhance={() => {
      uploading = true;
      uploadError = null;
      return async ({ result, update }) => {
        uploading = false;
        if (result.type === 'success' && result.data?.media) {
          const uploaded = result.data.media as Media;
          localMedia = [uploaded, ...localMedia];
          value = uploaded.id;
          dialogEl.close();
        } else if (result.type === 'failure') {
          uploadError = (result.data?.message as string) ?? 'Upload failed.';
        }
        await update({ reset: true });
      };
    }}
  >
    <h3>Upload new</h3>
    <label for="{id}-file" class="visually-hidden">Choose a file</label>
    <input id="{id}-file" type="file" name="file" {accept} required onchange={handleFileChange} />
    <p class="hint">Max size {maxSizeMB} MB.</p>
    <label for="{id}-alt" class="visually-hidden">Alt text</label>
    <input id="{id}-alt" type="text" name="altText" placeholder="Alt text (required)" required />
    <button type="submit" disabled={uploading || !!uploadError}>{uploading ? 'Uploading…' : 'Upload'}</button>
    {#if uploadError}<p class="error" role="alert">{uploadError}</p>{/if}
  </form>

  <button type="button" class="close" onclick={() => dialogEl.close()}>Close</button>
</dialog>

<style>
  .media-picker {
    margin-bottom: var(--space-5);
  }

  .picker-label {
    display: block;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
  }

  .preview {
    width: 160px;
    aspect-ratio: 3 / 2;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: var(--space-2);
  }

  .preview img,
  .preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    text-align: center;
    padding: var(--space-2);
  }

  .actions {
    display: flex;
    gap: var(--space-2);
  }

  .actions button {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    font-size: var(--font-size-sm);
  }

  .actions .ghost {
    color: var(--color-danger);
    border-color: transparent;
  }

  .picker-dialog {
    border: none;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-6);
    max-width: 560px;
    width: calc(100vw - var(--space-6));
  }

  .picker-dialog::backdrop {
    background: rgba(28, 25, 23, 0.4);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: var(--space-2);
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: var(--space-5);
  }

  .thumb {
    aspect-ratio: 1;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    padding: 0;
  }

  .thumb:hover {
    border-color: var(--color-accent);
  }

  .thumb img,
  .thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    align-items: center;
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-4);
  }

  form h3 {
    width: 100%;
    font-size: var(--font-size-sm);
    margin: 0 0 var(--space-2);
  }

  form input,
  form button {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .hint {
    width: 100%;
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .error {
    width: 100%;
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .close {
    margin-top: var(--space-4);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
  }
</style>
