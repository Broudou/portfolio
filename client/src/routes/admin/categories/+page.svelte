<script lang="ts">
  import { enhance } from '$app/forms';
  import { CATEGORY_APPLIES_TO } from '@portfolio/shared';
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

  const pendingCategory = $derived(data.categories.find((c) => c.id === pendingDeleteId));
</script>

<AdminHeader title="Categories" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    action="?/create"
    class="add-form"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === 'success') toastStore.push('Category added.', 'success');
        await update();
      };
    }}
  >
    <input name="name" type="text" placeholder="New category name" required />
    <select name="appliesTo">
      {#each CATEGORY_APPLIES_TO as option (option)}
        <option value={option}>{option}</option>
      {/each}
    </select>
    <button type="submit">Add</button>
    {#if form?.errors?.name}<p class="error">{form.errors.name[0]}</p>{/if}
  </form>

  {#if data.categories.length === 0}
    <EmptyState title="No categories yet" />
  {:else}
    <DataTable caption="Categories">
      <thead>
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th>Applies to</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.categories as category (category.id)}
          <tr>
            {#if editingId === category.id}
              <td colspan="4">
                <form
                  method="POST"
                  action="?/update"
                  class="edit-form"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      editingId = null;
                      if (result.type === 'success') toastStore.push('Category updated.', 'success');
                      await update();
                    };
                  }}
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input name="name" type="text" value={category.name} required />
                  <select name="appliesTo">
                    {#each CATEGORY_APPLIES_TO as option (option)}
                      <option value={option} selected={option === category.appliesTo}>{option}</option>
                    {/each}
                  </select>
                  <button type="submit">Save</button>
                  <button type="button" onclick={() => (editingId = null)}>Cancel</button>
                </form>
              </td>
            {:else}
              <td>{category.name}</td>
              <td><code>{category.slug}</code></td>
              <td>{category.appliesTo}</td>
              <td>
                <div class="row-actions">
                  <button type="button" onclick={() => (editingId = category.id)}>Edit</button>
                  <button type="button" class="link-danger" onclick={() => (pendingDeleteId = category.id)}>
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
      if (result.type === 'success') toastStore.push('Category deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete category?"
  message={`Delete "${pendingCategory?.name ?? ''}"? Projects and articles using it will keep no category.`}
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
  .add-form select,
  .edit-form input,
  .edit-form select {
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
