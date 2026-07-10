<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import DataTable from '$lib/components/admin/DataTable.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { formatDate } from '$lib/utils/date.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingPublication = $derived(data.publications.find((p) => p.id === pendingDeleteId));
</script>

<AdminHeader title="Publications" user={data.user}>
  {#snippet actions()}
    <Button href="/admin/publications/new" size="sm">New publication</Button>
  {/snippet}
</AdminHeader>

<div class="admin-body">
  {#if data.publications.length === 0}
    <EmptyState title="No publications yet">
      {#snippet action()}<Button href="/admin/publications/new">New publication</Button>{/snippet}
    </EmptyState>
  {:else}
    <DataTable caption="Publications">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Type</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.publications as publication (publication.id)}
          <tr>
            <td>{formatDate(publication.date)}</td>
            <td>{publication.title}</td>
            <td><Badge variant="accent">{publication.type}</Badge></td>
            <td>
              <div class="row-actions">
                <a href="/admin/publications/{publication.id}/edit">Edit</a>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = publication.id)}>
                  Delete
                </button>
              </div>
            </td>
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
      if (result.type === 'success') toastStore.push('Publication deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete publication?"
  message={`Delete "${pendingPublication?.title ?? ''}"? This cannot be undone.`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .row-actions {
    display: flex;
    gap: var(--space-3);
  }

  .row-actions a {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
  }

  .link-danger {
    background: none;
    border: none;
    color: var(--color-danger);
    font-weight: var(--font-weight-medium);
    padding: 0;
  }
</style>
