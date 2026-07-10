<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import PublicationForm from '$lib/components/admin/PublicationForm.svelte';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
</script>

<AdminHeader title="New publication" user={data.user} />

<div class="admin-body">
  <PublicationForm media={data.media} errors={form?.errors} message={form?.message} submitLabel="Create publication" />
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 640px;
  }
</style>
