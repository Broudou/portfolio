<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Photo } from '@portfolio/shared';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';

  interface Props {
    photos: Photo[];
  }

  let { photos }: Props = $props();

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  let uploading = $state(false);
  let uploadError = $state<string | null>(null);
  let savingOrder = $state(false);
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const sorted = $derived([...photos].sort((a, b) => a.order - b.order));

  function handleFilesChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const tooLarge = files.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (tooLarge) {
      uploadError = `"${tooLarge.name}" is too large (${(tooLarge.size / (1024 * 1024)).toFixed(1)} MB). Max size is ${MAX_FILE_SIZE_MB} MB.`;
      input.value = '';
    } else {
      uploadError = null;
    }
  }
</script>

<section class="photo-manager">
  <h2>Photos</h2>

  <form
    method="POST"
    action="?/addPhotos"
    enctype="multipart/form-data"
    class="upload-form"
    use:enhance={() => {
      uploading = true;
      uploadError = null;
      return async ({ result, update }) => {
        uploading = false;
        if (result.type === 'success') toastStore.push('Photos added.', 'success');
        else if (result.type === 'failure') uploadError = (result.data?.message as string) ?? 'Upload failed.';
        await update({ reset: true });
      };
    }}
  >
    <label for="files" class="visually-hidden">Choose photos</label>
    <input id="files" type="file" name="files" accept="image/*" multiple required onchange={handleFilesChange} />
    <p class="hint">Select multiple images at once. Max {MAX_FILE_SIZE_MB} MB per file.</p>
    <button type="submit" disabled={uploading || !!uploadError}>{uploading ? 'Uploading…' : 'Add photos'}</button>
    {#if uploadError}<p class="error" role="alert">{uploadError}</p>{/if}
  </form>

  {#if sorted.length === 0}
    <p class="empty">No photos in this album yet. Add some above.</p>
  {:else}
    <form
      method="POST"
      action="?/reorderPhotos"
      use:enhance={() => {
        savingOrder = true;
        return async ({ result, update }) => {
          savingOrder = false;
          if (result.type === 'success') toastStore.push('Order saved.', 'success');
          await update();
        };
      }}
    >
      <div class="grid">
        {#each sorted as photo (photo.id)}
          {@const image = populated(photo.image)}
          <div class="tile">
            {#if image}
              <img src={image.url} alt={image.altText} loading="lazy" />
            {/if}
            <div class="tile-footer">
              <label class="order-label">
                Order
                <input type="number" name="order_{photo.id}" value={photo.order} />
              </label>
              <button type="button" class="link-danger" onclick={() => (pendingDeleteId = photo.id)}>
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
      <button type="submit" class="save-order" disabled={savingOrder}>
        {savingOrder ? 'Saving…' : 'Save order'}
      </button>
    </form>
  {/if}
</section>

<form
  method="POST"
  action="?/deletePhoto"
  bind:this={deleteForm}
  class="visually-hidden"
  use:enhance={() => {
    return async ({ result, update }) => {
      pendingDeleteId = null;
      if (result.type === 'success') toastStore.push('Photo deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete photo?"
  message="Delete this photo? This cannot be undone."
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .photo-manager {
    margin-top: var(--space-8);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }

  h2 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-4);
  }

  .upload-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .upload-form input[type='file'] {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .upload-form button {
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
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
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .empty {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .tile {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .tile img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .tile-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }

  .order-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .order-label input {
    width: 56px;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .save-order {
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .save-order:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .link-danger {
    background: none;
    border: none;
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    padding: 0;
  }
</style>
