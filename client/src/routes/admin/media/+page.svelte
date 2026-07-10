<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
  let uploading = $state(false);
  let editingId = $state<string | null>(null);
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingMedia = $derived(data.media.find((m) => m.id === pendingDeleteId));
</script>

<AdminHeader title="Media library" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    action="?/upload"
    enctype="multipart/form-data"
    class="upload-form"
    use:enhance={() => {
      uploading = true;
      return async ({ result, update }) => {
        uploading = false;
        if (result.type === 'success') toastStore.push('Image uploaded.', 'success');
        await update({ reset: true });
      };
    }}
  >
    <input type="file" name="file" accept="image/*" required />
    <input type="text" name="altText" placeholder="Alt text (required)" required />
    <button type="submit" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload'}</button>
    {#if form?.message}<p class="error">{form.message}</p>{/if}
  </form>

  {#if data.media.length === 0}
    <EmptyState title="No media yet" description="Upload your first image above." />
  {:else}
    <div class="grid">
      {#each data.media as item (item.id)}
        <div class="tile">
          <img src={item.url} alt={item.altText} loading="lazy" />
          {#if editingId === item.id}
            <form
              method="POST"
              action="?/updateAlt"
              class="alt-form"
              use:enhance={() => {
                return async ({ result, update }) => {
                  editingId = null;
                  if (result.type === 'success') toastStore.push('Alt text updated.', 'success');
                  await update();
                };
              }}
            >
              <input type="hidden" name="id" value={item.id} />
              <input type="text" name="altText" value={item.altText} required />
              <div class="tile-actions">
                <button type="submit">Save</button>
                <button type="button" onclick={() => (editingId = null)}>Cancel</button>
              </div>
            </form>
          {:else}
            <p class="alt-text">{item.altText}</p>
            <div class="tile-actions">
              <button type="button" onclick={() => (editingId = item.id)}>Edit alt text</button>
              <button type="button" class="link-danger" onclick={() => (pendingDeleteId = item.id)}>Delete</button>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <Pagination meta={data.meta} buildHref={(page) => `/admin/media?page=${page}`} />
  {/if}
</div>

<form
  method="POST"
  action="?/delete"
  bind:this={deleteForm}
  class="visually-hidden"
  use:enhance={() => {
    return async ({ result, update }) => {
      pendingDeleteId = null;
      if (result.type === 'success') toastStore.push('Image deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete image?"
  message={`Delete "${pendingMedia?.altText ?? ''}"? Anything referencing it will show a broken image.`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .upload-form {
    display: flex;
    gap: var(--space-3);
    align-items: center;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
  }

  .upload-form input[type='text'] {
    flex: 1;
    min-width: 200px;
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

  .error {
    width: 100%;
    color: var(--color-danger);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-5);
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
  }

  .alt-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    padding: var(--space-2) var(--space-3) 0;
    margin: 0;
  }

  .tile-actions {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3) var(--space-3);
  }

  .tile-actions button {
    background: none;
    border: none;
    color: var(--color-accent);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    padding: 0;
  }

  .link-danger {
    color: var(--color-danger) !important;
  }

  .alt-form {
    padding: var(--space-2) var(--space-3) var(--space-3);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .alt-form input {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
  }
</style>
