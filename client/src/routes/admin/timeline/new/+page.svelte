<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import TimelineEventForm from '$lib/components/admin/TimelineEventForm.svelte';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
</script>

<AdminHeader title="New timeline event" user={data.user} />

<div class="admin-body">
  <TimelineEventForm errors={form?.errors} message={form?.message} submitLabel="Create event" />
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 640px;
  }
</style>
