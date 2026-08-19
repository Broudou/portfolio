<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import AlbumForm from '$lib/components/admin/AlbumForm.svelte';
  import PhotoManager from '$lib/components/admin/PhotoManager.svelte';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
</script>

<AdminHeader title="Edit album" user={data.user} />

<div class="admin-body">
  {#key data.album.id}
    <AlbumForm
      album={data.album}
      media={data.media}
      errors={form?.errors}
      message={form?.message}
      submitLabel="Save changes"
    />
  {/key}

  <PhotoManager photos={data.photos} />
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }
</style>
