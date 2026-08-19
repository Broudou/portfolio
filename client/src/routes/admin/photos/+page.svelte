<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import DataTable from '$lib/components/admin/DataTable.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingAlbum = $derived(data.albums.find((a) => a.id === pendingDeleteId));
</script>

<AdminHeader title="Photos" user={data.user}>
  {#snippet actions()}
    <Button href="/admin/photos/new" size="sm">New album</Button>
  {/snippet}
</AdminHeader>

<div class="admin-body">
  {#if data.albums.length === 0}
    <EmptyState title="No albums yet" description="Create your first photo album to get started.">
      {#snippet action()}<Button href="/admin/photos/new">New album</Button>{/snippet}
    </EmptyState>
  {:else}
    <DataTable caption="Photo albums">
      <thead>
        <tr>
          <th><span class="visually-hidden">Cover</span></th>
          <th>Title</th>
          <th>Status</th>
          <th>Featured</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.albums as album (album.id)}
          {@const cover = populated(album.cover)}
          <tr>
            <td class="cover-cell">
              {#if cover}
                <img src={cover.url} alt="" loading="lazy" />
              {/if}
            </td>
            <td>{album.title}</td>
            <td><Badge variant={album.status === 'published' ? 'success' : 'neutral'}>{album.status}</Badge></td>
            <td>{album.featured ? 'Yes' : 'No'}</td>
            <td>
              <div class="row-actions">
                <a href="/admin/photos/{album.id}/edit">Edit</a>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = album.id)}>
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
      if (result.type === 'success') toastStore.push('Album deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete album?"
  message={`Delete "${pendingAlbum?.title ?? ''}"? This also deletes every photo in it. This cannot be undone.`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .cover-cell img {
    width: 64px;
    height: 48px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    display: block;
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
