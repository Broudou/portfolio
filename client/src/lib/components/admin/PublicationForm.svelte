<script lang="ts">
  import { enhance } from '$app/forms';
  import { PUBLICATION_TYPES } from '@portfolio/shared';
  import type { Media, Publication } from '@portfolio/shared';
  import FormField from './FormField.svelte';
  import MediaPicker from './MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';

  interface FormErrors {
    [key: string]: string[] | undefined;
  }

  interface Props {
    publication?: Publication;
    media: Media[];
    errors?: FormErrors;
    message?: string;
    submitLabel?: string;
  }

  let { publication, media, errors, message, submitLabel = 'Save publication' }: Props = $props();

  let coverImageId = $state<string | null>(populated(publication?.coverImage)?.id ?? null);
  let submitting = $state(false);

  function toDateInputValue(iso?: string | null): string {
    return iso ? iso.slice(0, 10) : '';
  }
</script>

<form
  method="POST"
  use:enhance={() => {
    submitting = true;
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') toastStore.push('Publication saved.', 'success');
      await update();
    };
  }}
>
  <FormField label="Title" id="title" required error={errors?.title?.[0]}>
    <input id="title" name="title" type="text" required value={publication?.title ?? ''} />
  </FormField>

  <FormField label="Type" id="type" required>
    <select id="type" name="type" required>
      {#each PUBLICATION_TYPES as type (type)}
        <option value={type} selected={type === publication?.type}>{type}</option>
      {/each}
    </select>
  </FormField>

  <FormField label="Venue" id="venue" required error={errors?.venue?.[0]}>
    <input id="venue" name="venue" type="text" required value={publication?.venue ?? ''} />
  </FormField>

  <div class="row">
    <FormField label="Date" id="date" required>
      <input id="date" name="date" type="date" required value={toDateInputValue(publication?.date)} />
    </FormField>
    <FormField label="URL" id="url" hint="Link to the talk/publication.">
      <input id="url" name="url" type="url" value={publication?.url ?? ''} />
    </FormField>
  </div>

  <FormField label="Description" id="description">
    <textarea id="description" name="description" rows="3">{publication?.description ?? ''}</textarea>
  </FormField>

  <FormField label="Co-authors" id="coAuthors" hint="Comma-separated.">
    <input id="coAuthors" name="coAuthors" type="text" value={(publication?.coAuthors ?? []).join(', ')} />
  </FormField>

  <FormField label="Slides URL" id="slidesUrl">
    <input id="slidesUrl" name="slidesUrl" type="url" value={publication?.slidesUrl ?? ''} />
  </FormField>

  <MediaPicker id="coverImage" label="Cover image" bind:value={coverImageId} {media} />

  {#if message}<p class="error">{message}</p>{/if}

  <button type="submit" class="save" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button>
</form>

<style>
  .row {
    display: flex;
    gap: var(--space-5);
    flex-wrap: wrap;
  }

  .row > :global(.form-field) {
    flex: 1;
    min-width: 160px;
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
