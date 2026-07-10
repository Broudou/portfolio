<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { formatDate } from '$lib/utils/date.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let expandedId = $state<string | null>(null);
  let pendingDeleteId = $state<string | null>(null);
  let deleteForm: HTMLFormElement;

  const pendingMessage = $derived(data.messages.find((m) => m.id === pendingDeleteId));

  function toggleExpand(id: string) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<AdminHeader title="Messages" user={data.user} />

<div class="admin-body">
  {#if data.messages.length === 0}
    <EmptyState title="No messages yet" />
  {:else}
    <ul class="message-list">
      {#each data.messages as message (message.id)}
        <li class:unread={!message.isRead}>
          <button type="button" class="summary" onclick={() => toggleExpand(message.id)}>
            {#if !message.isRead}<Badge variant="accent">New</Badge>{/if}
            <span class="name">{message.name}</span>
            <span class="subject">{message.subject}</span>
            <span class="date">{formatDate(message.createdAt)}</span>
          </button>

          {#if expandedId === message.id}
            <div class="detail">
              <p class="from">From: {message.name} &lt;{message.email}&gt;</p>
              <p class="body">{message.message}</p>
              <div class="actions">
                <form
                  method="POST"
                  action="?/toggleRead"
                  use:enhance={() => async ({ update }) => update()}
                >
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="isRead" value={(!message.isRead).toString()} />
                  <button type="submit">{message.isRead ? 'Mark unread' : 'Mark read'}</button>
                </form>
                <button type="button" class="link-danger" onclick={() => (pendingDeleteId = message.id)}>
                  Delete
                </button>
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>

    <Pagination meta={data.meta} buildHref={(page) => `/admin/messages?page=${page}`} />
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
      if (result.type === 'success') toastStore.push('Message deleted.', 'success');
      await update();
    };
  }}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ''} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  title="Delete message?"
  message={`Delete the message from "${pendingMessage?.name ?? ''}"?`}
  onconfirm={() => deleteForm.requestSubmit()}
  oncancel={() => (pendingDeleteId = null)}
/>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .message-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  li {
    border-bottom: 1px solid var(--color-border);
  }

  li:last-child {
    border-bottom: none;
  }

  li.unread {
    background: var(--color-pastel-blue);
  }

  .summary {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4);
    background: none;
    border: none;
    text-align: left;
    font-size: var(--font-size-sm);
  }

  .name {
    font-weight: var(--font-weight-medium);
    min-width: 140px;
  }

  .subject {
    flex: 1;
    color: var(--color-text-secondary);
  }

  .date {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
  }

  .detail {
    padding: 0 var(--space-4) var(--space-4);
  }

  .from {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .body {
    white-space: pre-wrap;
    margin-bottom: var(--space-4);
  }

  .actions {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .actions button {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }

  .link-danger {
    color: var(--color-danger);
    border-color: transparent !important;
  }
</style>
