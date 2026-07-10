<script lang="ts">
  import type { Snippet } from 'svelte';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import { page } from '$app/state';
  import type { LayoutData } from './$types.js';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if data.user}
  <div class="admin-shell">
    <AdminSidebar currentPath={page.url.pathname} unreadMessagesCount={data.unreadMessagesCount} />
    <div class="admin-content">
      {@render children()}
    </div>
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .admin-shell {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
  }

  .admin-content {
    min-width: 0;
  }

  @media (max-width: 768px) {
    .admin-shell {
      grid-template-columns: 1fr;
    }
  }
</style>
