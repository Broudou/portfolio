<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import AlbumForm from '$lib/components/admin/AlbumForm.svelte';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
</script>

<AdminHeader title="New album" user={data.user} />

<div class="admin-body">
  <p class="hint">Save the album first, then add photos to it on the next screen.</p>
  <AlbumForm errors={form?.errors} message={form?.message} submitLabel="Create album" />
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }

  .hint {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-5);
  }
</style>
