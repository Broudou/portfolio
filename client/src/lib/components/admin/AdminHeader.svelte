<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { AuthUser } from '@portfolio/shared';

  interface Props {
    title: string;
    user: AuthUser;
    actions?: Snippet;
  }

  let { title, user, actions }: Props = $props();
</script>

<header class="admin-header">
  <h1>{title}</h1>
  <div class="right">
    {#if actions}{@render actions()}{/if}
    <span class="user">{user.name}</span>
    <form method="POST" action="/admin/logout">
      <button type="submit" class="logout">Log out</button>
    </form>
  </div>
</header>

<style>
  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5) var(--space-6);
    border-bottom: 1px solid var(--color-border);
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  h1 {
    margin: 0;
    font-size: var(--font-size-xl);
  }

  .right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .user {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .logout {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }

  .logout:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
