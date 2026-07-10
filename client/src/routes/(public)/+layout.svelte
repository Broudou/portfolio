<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import SkipToContent from '$lib/components/layout/SkipToContent.svelte';
  import Nav from '$lib/components/layout/Nav.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import type { PageData } from './$types.js';

  interface Props {
    data: PageData;
    children: Snippet;
  }

  let { data, children }: Props = $props();
</script>

<SkipToContent />
<Nav items={data.navigation} siteTitle={data.settings.siteTitle} currentPath={page.url.pathname} />

<main id="main-content" tabindex="-1">
  {@render children()}
</main>

<Footer footerText={data.settings.footerText} socialLinks={data.settings.socialLinks} />
