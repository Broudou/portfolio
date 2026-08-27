<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import SkipToContent from '$lib/components/layout/SkipToContent.svelte';
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { pageChrome } from '$lib/stores/pageChrome.svelte.js';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  /**
   * Whether the current route has an active hero banner (Home/Biography with
   * a background configured). Each such page's own `+page.server.ts` sets
   * this on its load data so it's known synchronously at SSR time — reading
   * it here avoids a padding-top layout shift that a client-only mount
   * effect would cause on first paint.
   */
  const heroActive = $derived(!!(page.data as { hasHeroBackground?: boolean }).hasHeroBackground);
</script>

<SkipToContent />
<Nav items={data.navigation} currentPath={page.url.pathname} hasBackground={heroActive} />

<main id="main-content" tabindex="-1" style="padding-top: {heroActive ? 0 : pageChrome.navHeight}px">
  {@render children()}
</main>

<Footer
  footerText={data.settings.footerText}
  socialLinks={data.settings.socialLinks}
  hasBackground={heroActive}
/>
