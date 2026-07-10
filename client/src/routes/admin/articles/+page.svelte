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

  const pendingArticle = $derived(data.articles.find((a) => a.id === pendingDeleteId));
</script>

<AdminHeader title="Articles" user={data.user}>
  {#snippet actions()}
    <Button href="/admin/articles/new" size="sm">New article</Button>
  {/snippet}
</AdminHeader>

<div class="admin-body">
  {#if data.articles.length === 0}
    <EmptyState title="No articles yet" description="Write your first article to get started.">
      {#snippet action()}<Button href="/admin/articles/new">New article</Button>{/snippet}
    </EmptyState>
  {:else}
    <DataTable caption="Articles">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Published</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each data.articles as article (article.id)}
          <tr>
            <td>{article.title}</td>
            <td><Badge variant={article.status === 'published' ? 'success' : 'neutral'}>{article.status}</Badge></td>
            <td>{article.publishedAt ? formatDate(article.publishedAt) : '—'}</td>
            <td>
              <div class="row-actions">
                <a href="/admin/articles/{article.id}/edit">Edit</a>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = article.id)}>
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
      if (result.type === 'success') toastStore.push('Article deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete article?"
  message={`Delete "${pendingArticle?.title ?? ''}"? This cannot be undone.`}
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
