<script lang="ts">
  import { enhance } from '$app/forms';
  import type { NavigationItem } from '@portfolio/shared';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import ReorderableList from '$lib/components/admin/ReorderableList.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
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
  let reorderForm: HTMLFormElement;
  let orderedIdsCsv = $state('');

  const pendingItem = $derived(data.items.find((i) => i.id === pendingDeleteId));

  function handleReorder(orderedIds: string[]) {
    orderedIdsCsv = orderedIds.join(',');
    reorderForm.requestSubmit();
  }
</script>

<AdminHeader title="Navigation" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    action="?/create"
    class="add-form"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === 'success') toastStore.push('Navigation item added.', 'success');
        await update();
      };
    }}
  >
    <input name="label" type="text" placeholder="Label" required />
    <input name="path" type="text" placeholder="/path" required />
    <button type="submit">Add</button>
    {#if form?.errors?.label}<p class="error">{form.errors.label[0]}</p>{/if}
  </form>

  <ReorderableList items={data.items} getId={(item: NavigationItem) => item.id} onReorder={handleReorder}>
    {#snippet row(item: NavigationItem)}
      {#if editingId === item.id}
        <form
          method="POST"
          action="?/update"
          class="edit-form"
          use:enhance={() => {
            return async ({ result, update }) => {
              editingId = null;
              if (result.type === 'success') toastStore.push('Navigation item updated.', 'success');
              await update();
            };
          }}
        >
          <input type="hidden" name="id" value={item.id} />
          <input name="label" type="text" value={item.label} required />
          <input name="path" type="text" value={item.path} required />
          <label><input type="checkbox" name="isVisible" checked={item.isVisible} /> Visible</label>
          <label><input type="checkbox" name="isExternal" checked={item.isExternal} /> External</label>
          <label><input type="checkbox" name="openInNewTab" checked={item.openInNewTab} /> New tab</label>
          <button type="submit">Save</button>
          <button type="button" onclick={() => (editingId = null)}>Cancel</button>
        </form>
      {:else}
        <div class="item-row">
          <div>
            <strong>{item.label}</strong>
            <code>{item.path}</code>
            {#if !item.isVisible}<span class="hidden-badge">Hidden</span>{/if}
          </div>
          <div class="item-actions">
            <button type="button" onclick={() => (editingId = item.id)}>Edit</button>
            <button type="button" class="link-danger" onclick={() => (pendingDeleteId = item.id)}>Delete</button>
          </div>
        </div>
      {/if}
    {/snippet}
  </ReorderableList>
</div>

<form
  method="POST"
  action="?/reorder"
  bind:this={reorderForm}
  class="visually-hidden"
  use:enhance={() => {
    return async ({ update }) => {
      await update();
    };
  }}
>
  <input type="hidden" name="orderedIds" value={orderedIdsCsv} />
</form>

<form
  method="POST"
  action="?/delete"
  bind:this={deleteForm}
  class="visually-hidden"
  use:enhance={() => {
    return async ({ result, update }) => {
      pendingDeleteId = null;
      if (result.type === 'success') toastStore.push('Navigation item deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete navigation item?"
  message={`Delete "${pendingItem?.label ?? ''}"?`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }

  .add-form {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }

  .add-form input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .add-form button {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
  }

  .error {
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    font-size: var(--font-size-sm);
  }

  .item-row code {
    margin-left: var(--space-2);
    color: var(--color-text-secondary);
  }

  .hidden-badge {
    margin-left: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--color-warning);
  }

  .item-actions {
    display: flex;
    gap: var(--space-3);
  }

  .item-actions button {
    background: none;
    border: none;
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
    padding: 0;
  }

  .link-danger {
    color: var(--color-danger) !important;
  }

  .edit-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--font-size-sm);
  }

  .edit-form input[type='text'] {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .edit-form label {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .edit-form button {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
  }
</style>
