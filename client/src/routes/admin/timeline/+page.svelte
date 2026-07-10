<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import DataTable from '$lib/components/admin/DataTable.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { formatMonthYear } from '$lib/utils/date.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingEvent = $derived(data.events.find((e) => e.id === pendingDeleteId));
</script>

<AdminHeader title="Timeline" user={data.user}>
  {#snippet actions()}
    <Button href="/admin/timeline/new" size="sm">New event</Button>
  {/snippet}
</AdminHeader>

<div class="admin-body">
  {#if data.events.length === 0}
    <EmptyState title="No timeline events yet">
      {#snippet action()}<Button href="/admin/timeline/new">New event</Button>{/snippet}
    </EmptyState>
  {:else}
    <DataTable caption="Timeline events">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Type</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.events as event (event.id)}
          <tr>
            <td>{formatMonthYear(event.date)}</td>
            <td>{event.title}</td>
            <td><Badge variant="accent">{event.type}</Badge></td>
            <td>
              <div class="row-actions">
                <a href="/admin/timeline/{event.id}/edit">Edit</a>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = event.id)}>
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
      if (result.type === 'success') toastStore.push('Timeline event deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete timeline event?"
  message={`Delete "${pendingEvent?.title ?? ''}"? This cannot be undone.`}
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
