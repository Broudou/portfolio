<script lang="ts">
  import '$lib/styles/global.css';
  import type { Snippet } from 'svelte';
  import Toast from '$lib/components/ui/Toast.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children()}
<Toast />
