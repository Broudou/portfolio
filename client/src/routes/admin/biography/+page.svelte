<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import FormField from '$lib/components/admin/FormField.svelte';
  import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';
  import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();

  let bioMarkdown = $state(data.biography.bioMarkdown);
  let avatarId = $state<string | null>(populated(data.biography.avatar)?.id ?? null);
  let saving = $state(false);
</script>

<AdminHeader title="Biography" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    use:enhance={() => {
      saving = true;
      return async ({ result, update }) => {
        saving = false;
        if (result.type === 'success') toastStore.push('Biography saved.', 'success');
        await update();
      };
    }}
  >
    <FormField label="Full name" id="fullName" required error={form?.errors?.fullName?.[0]}>
      <input id="fullName" name="fullName" type="text" required value={data.biography.fullName} />
    </FormField>

    <FormField label="Headline" id="headline" required error={form?.errors?.headline?.[0]}>
      <input id="headline" name="headline" type="text" required value={data.biography.headline} />
    </FormField>

    <FormField label="Summary" id="summary" hint="A one-sentence summary shown on the homepage hero." required error={form?.errors?.summary?.[0]}>
      <textarea id="summary" name="summary" rows="2" required>{data.biography.summary}</textarea>
    </FormField>

    <FormField label="Location" id="location">
      <input id="location" name="location" type="text" value={data.biography.location ?? ''} />
    </FormField>

    <MediaPicker id="avatar" label="Avatar" bind:value={avatarId} media={data.media} />

    <MarkdownEditor id="bioMarkdown" label="Biography (Markdown)" bind:value={bioMarkdown} required />
    <input type="hidden" name="bioMarkdown" value={bioMarkdown} />

    <FormField label="Skills" id="skills" hint="One per line.">
      <textarea id="skills" name="skills" rows="6">{data.biography.skills.join('\n')}</textarea>
    </FormField>

    <FormField label="Highlights" id="highlights" hint="One per line.">
      <textarea id="highlights" name="highlights" rows="6">{data.biography.highlights.join('\n')}</textarea>
    </FormField>

    <fieldset>
      <legend>SEO</legend>
      <FormField label="SEO title override" id="seoTitle">
        <input id="seoTitle" name="seoTitle" type="text" value={data.biography.seo?.title ?? ''} />
      </FormField>
      <FormField label="SEO description override" id="seoDescription">
        <textarea id="seoDescription" name="seoDescription" rows="2">{data.biography.seo?.description ?? ''}</textarea>
      </FormField>
    </fieldset>

    {#if form?.message}<p class="error">{form.message}</p>{/if}

    <button type="submit" class="save" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
  </form>
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }

  fieldset {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    margin: var(--space-2) 0 var(--space-5);
  }

  legend {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    padding-inline: var(--space-2);
  }

  .error {
    color: var(--color-danger);
    margin-bottom: var(--space-4);
  }

  .save {
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
  }

  .save:hover {
    background: var(--color-accent);
  }
</style>
