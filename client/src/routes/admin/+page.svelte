<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const tiles = $derived([
    { label: 'Projects', value: data.counts.projects, href: '/admin/projects' },
    { label: 'Articles', value: data.counts.articles, href: '/admin/articles' },
    { label: 'Categories', value: data.counts.categories, href: '/admin/categories' },
    { label: 'Tags', value: data.counts.tags, href: '/admin/tags' },
    { label: 'Timeline events', value: data.counts.timeline, href: '/admin/timeline' },
    { label: 'Publications', value: data.counts.publications, href: '/admin/publications' },
    { label: 'Unread messages', value: data.counts.unreadMessages, href: '/admin/messages' },
  ]);
</script>

<svelte:head>
  <title>Dashboard — Admin</title>
</svelte:head>

<AdminHeader title="Dashboard" user={data.user} />

<div class="admin-body">
  <p class="intro">Welcome back, {data.user.name.split(' ')[0]}. Here's a snapshot of your content.</p>

  <div class="tiles">
    {#each tiles as tile (tile.label)}
      <Card href={tile.href}>
        <p class="value">{tile.value}</p>
        <p class="label">{tile.label}</p>
      </Card>
    {/each}
  </div>
</div>

<style>
  .admin-body {
    padding: var(--space-6);
  }

  .intro {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-4);
  }

  .value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-semibold);
    margin: 0;
  }

  .label {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
  }
</style>
