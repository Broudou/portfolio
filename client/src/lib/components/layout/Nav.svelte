<script lang="ts">
  import type { NavigationItem } from '@portfolio/shared';
  import { pageChrome } from '$lib/stores/pageChrome.svelte.js';

  interface Props {
    items: NavigationItem[];
    currentPath: string;
    hasBackground?: boolean;
  }

  let { items, currentPath, hasBackground = false }: Props = $props();
  let menuOpen = $state(false);
  let headerHeight = $state(0);
  let scrolledPastHero = $state(false);

  $effect(() => {
    pageChrome.setNavHeight(headerHeight);
  });

  function updateScrolledPastHero() {
    scrolledPastHero = window.scrollY >= window.innerHeight - headerHeight;
  }

  $effect(() => {
    // Recheck whenever the route or header height changes (e.g. navigating
    // to/from a hero page resets scroll position; header height can change
    // between mobile/desktop nav layouts).
    currentPath;
    headerHeight;
    updateScrolledPastHero();
  });

  function isActive(path: string): boolean {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeMenu();
  }
</script>

<svelte:window onkeydown={handleKeydown} onscroll={updateScrolledPastHero} />

<header
  class="site-header"
  class:transparent={hasBackground && !scrolledPastHero}
  bind:clientHeight={headerHeight}
>
  <div class="container bar">
    <button
      class="menu-toggle"
      type="button"
      aria-expanded={menuOpen}
      aria-controls="primary-navigation"
      onclick={() => (menuOpen = !menuOpen)}
    >
      <span class="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        {#if menuOpen}
          <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        {:else}
          <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        {/if}
      </svg>
    </button>

    <nav id="primary-navigation" aria-label="Primary" class:open={menuOpen}>
      <ul>
        {#each items as item (item.id)}
          <li>
            <a
              href={item.path}
              target={item.openInNewTab ? '_blank' : undefined}
              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
              aria-current={isActive(item.path) ? 'page' : undefined}
              onclick={closeMenu}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition:
      background-color var(--duration-base) var(--easing-standard),
      border-color var(--duration-base) var(--easing-standard);
  }

  .site-header.transparent {
    background: transparent;
    border-bottom-color: transparent;
  }

  .site-header.transparent nav a,
  .site-header.transparent .menu-toggle {
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .site-header.transparent nav a[aria-current='page'] {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }

  .bar {
    display: flex;
    align-items: center;
    padding-block: var(--space-4);
  }

  .menu-toggle {
    display: none;
    margin-left: auto;
    background: none;
    border: none;
    padding: var(--space-2);
    color: var(--color-text-primary);
  }

  nav ul {
    display: flex;
    gap: var(--space-6);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  nav a {
    color: var(--color-text-primary);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    padding-block: var(--space-2);
    border-bottom: 2px solid transparent;
  }

  nav a:hover {
    color: var(--color-accent);
  }

  nav a[aria-current='page'] {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    nav {
      display: none;
      position: absolute;
      inset-inline: 0;
      top: 100%;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
    }

    nav.open {
      display: block;
    }

    nav ul {
      flex-direction: column;
      gap: 0;
      padding: var(--space-3) var(--space-5) var(--space-5);
    }

    nav a {
      display: block;
      padding: var(--space-3) 0;
    }
  }
</style>
