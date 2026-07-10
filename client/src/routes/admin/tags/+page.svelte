<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import DataTable from '$lib/components/admin/DataTable.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
  let editingId = $state<string | null>(null);
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingTag = $derived(data.tags.find((t) => t.id === pendingDeleteId));
</script>

<AdminHeader title="Tags" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    action="?/create"
    class="add-form"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === 'success') toastStore.push('Tag added.', 'success');
        await update();
      };
    }}
  >
    <input name="name" type="text" placeholder="New tag name" required />
    <button type="submit">Add</button>
    {#if form?.errors?.name}<p class="error">{form.errors.name[0]}</p>{/if}
  </form>

  {#if data.tags.length === 0}
    <EmptyState title="No tags yet" />
  {:else}
    <DataTable caption="Tags">
      <thead>
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.tags as tag (tag.id)}
          <tr>
            {#if editingId === tag.id}
              <td colspan="3">
                <form
                  method="POST"
                  action="?/update"
                  class="edit-form"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      editingId = null;
                      if (result.type === 'success') toastStore.push('Tag updated.', 'success');
                      await update();
                    };
                  }}
                >
                  <input type="hidden" name="id" value={tag.id} />
                  <input name="name" type="text" value={tag.name} required />
                  <button type="submit">Save</button>
                  <button type="button" onclick={() => (editingId = null)}>Cancel</button>
                </form>
              </td>
            {:else}
              <td>{tag.name}</td>
              <td><code>{tag.slug}</code></td>
              <td>
                <div class="row-actions">
                  <button type="button" onclick={() => (editingId = tag.id)}>Edit</button>
                  <button type="button" class="link-danger" onclick={() => (pendingDeleteId = tag.id)}>
                    Delete
                  </button>
                </div>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </DataTable>
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
      if (result.type === 'success') toastStore.push('Tag deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete tag?"
  message={`Delete "${pendingTag?.name ?? ''}"? Projects and articles using it will keep no tag.`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .add-form,
  .edit-form {
    display: flex;
    gap: var(--space-3);
    align-items: center;
    margin-bottom: var(--space-5);
  }

  .add-form input,
  .edit-form input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .add-form button,
  .edit-form button {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-text-primary);
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
  }

  .row-actions {
    display: flex;
    gap: var(--space-3);
  }

  .row-actions button {
    background: none;
    border: none;
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
    padding: 0;
  }

  .link-danger {
    color: var(--color-danger) !important;
  }

  .error {
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin: 0;
  }
</style>
