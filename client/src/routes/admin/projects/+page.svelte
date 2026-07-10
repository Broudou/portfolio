<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import DataTable from '$lib/components/admin/DataTable.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingProject = $derived(data.projects.find((p) => p.id === pendingDeleteId));
</script>

<AdminHeader title="Projects" user={data.user}>
  {#snippet actions()}
    <Button href="/admin/projects/new" size="sm">New project</Button>
  {/snippet}
</AdminHeader>

<div class="admin-body">
  {#if data.projects.length === 0}
    <EmptyState title="No projects yet" description="Create your first project to get started.">
      {#snippet action()}<Button href="/admin/projects/new">New project</Button>{/snippet}
    </EmptyState>
  {:else}
    <DataTable caption="Projects">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Featured</th>
          <th>Start date</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.projects as project (project.id)}
          <tr>
            <td>{project.title}</td>
            <td><Badge variant={project.status === 'published' ? 'success' : 'neutral'}>{project.status}</Badge></td>
            <td>{project.featured ? 'Yes' : 'No'}</td>
            <td>{new Date(project.startDate).toLocaleDateString()}</td>
            <td>
              <div class="row-actions">
                <a href="/admin/projects/{project.id}/edit">Edit</a>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = project.id)}>
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
      if (result.type === 'success') toastStore.push('Project deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete project?"
  message={`Delete "${pendingProject?.title ?? ''}"? This cannot be undone.`}
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
