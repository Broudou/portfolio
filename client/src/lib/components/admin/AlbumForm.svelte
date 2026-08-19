<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Album, Media } from '@portfolio/shared';
  import FormField from './FormField.svelte';
  import MediaPicker from './MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';

  interface FormErrors {
    [key: string]: string[] | undefined;
  }

  interface Props {
    album?: Album;
    media: Media[];
    errors?: FormErrors;
    message?: string;
    submitLabel?: string;
    action?: string;
  }

  let { album, media, errors, message, submitLabel = 'Save album', action }: Props = $props();

  let coverId = $state<string | null>(populated(album?.cover)?.id ?? null);
  let submitting = $state(false);
</script>

<form
  method="POST"
  {action}
  use:enhance={() => {
    submitting = true;
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') toastStore.push('Album saved.', 'success');
      await update();
    };
  }}
>
  <FormField label="Title" id="title" required error={errors?.title?.[0]}>
    <input id="title" name="title" type="text" required value={album?.title ?? ''} />
  </FormField>

  <FormField label="Slug" id="slug" hint="Leave blank to auto-generate from the title.">
    <input id="slug" name="slug" type="text" value={album?.slug ?? ''} />
  </FormField>

  <FormField label="Description" id="description">
    <textarea id="description" name="description" rows="3">{album?.description ?? ''}</textarea>
  </FormField>

  <MediaPicker id="cover" label="Cover image" bind:value={coverId} {media} />

  <div class="row">
    <label class="checkbox">
      <input type="checkbox" name="featured" checked={album?.featured ?? false} />
      Featured on homepage
    </label>
    <FormField label="Status" id="status">
      <select id="status" name="status">
        <option value="draft" selected={album?.status !== 'published'}>Draft</option>
        <option value="published" selected={album?.status === 'published'}>Published</option>
      </select>
    </FormField>
    <FormField label="Order" id="order" hint="Lower numbers appear first.">
      <input id="order" name="order" type="number" value={album?.order ?? 0} />
    </FormField>
  </div>

  <fieldset>
    <legend>SEO</legend>
    <FormField label="SEO title override" id="seoTitle">
      <input id="seoTitle" name="seoTitle" type="text" value={album?.seo?.title ?? ''} />
    </FormField>
    <FormField label="SEO description override" id="seoDescription">
      <textarea id="seoDescription" name="seoDescription" rows="2">{album?.seo?.description ?? ''}</textarea>
    </FormField>
  </fieldset>

  {#if message}<p class="error">{message}</p>{/if}

  <button type="submit" class="save" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button>
</form>

<style>
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

  .row {
    display: flex;
    gap: var(--space-5);
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .row > :global(.form-field) {
    flex: 1;
    min-width: 160px;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    padding-top: var(--space-6);
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
