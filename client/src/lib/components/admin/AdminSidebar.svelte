<script lang="ts">
  interface Props {
    currentPath: string;
    unreadMessagesCount?: number;
  }

  let { currentPath, unreadMessagesCount = 0 }: Props = $props();

  const LINKS = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Biography', path: '/admin/biography' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Articles', path: '/admin/articles' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Tags', path: '/admin/tags' },
    { label: 'Media', path: '/admin/media' },
    { label: 'Navigation', path: '/admin/navigation' },
    { label: 'Timeline', path: '/admin/timeline' },
    { label: 'Publications', path: '/admin/publications' },
    { label: 'Settings', path: '/admin/settings' },
    { label: 'Messages', path: '/admin/messages' },
  ];

  function isActive(path: string): boolean {
    return path === '/admin' ? currentPath === '/admin' : currentPath.startsWith(path);
  }
</script>

<nav class="admin-sidebar" aria-label="Admin">
  <a href="/" class="back-to-site">← View site</a>
  <ul>
    {#each LINKS as link (link.path)}
      <li>
        <a href={link.path} aria-current={isActive(link.path) ? 'page' : undefined}>
          {link.label}
          {#if link.path === '/admin/messages' && unreadMessagesCount > 0}
            <span class="count">{unreadMessagesCount}</span>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .admin-sidebar {
    padding: var(--space-5);
    border-right: 1px solid var(--color-border);
    height: 100%;
  }

  .back-to-site {
    display: inline-block;
    margin-bottom: var(--space-6);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }
  .back-to-site:hover {
    color: var(--color-accent);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  a:hover {
    background: var(--color-surface);
  }

  a[aria-current='page'] {
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
  }

  .count {
    background: var(--color-accent);
    color: var(--color-text-inverse);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    padding: 0 var(--space-2);
  }
</style>
