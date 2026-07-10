<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
</script>

<AdminHeader title="Edit article" user={data.user} />

<div class="admin-body">
  {#key data.article.id}
    <ArticleForm
      article={data.article}
      categories={data.categories}
      tags={data.tags}
      media={data.media}
      errors={form?.errors}
      message={form?.message}
      submitLabel="Save changes"
    />
  {/key}
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }
</style>
