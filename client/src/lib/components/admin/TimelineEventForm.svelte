<script lang="ts">
  import { enhance } from '$app/forms';
  import { TIMELINE_EVENT_TYPES } from '@portfolio/shared';
  import type { TimelineEvent } from '@portfolio/shared';
  import FormField from './FormField.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';

  interface FormErrors {
    [key: string]: string[] | undefined;
  }

  interface Props {
    event?: TimelineEvent;
    errors?: FormErrors;
    message?: string;
    submitLabel?: string;
  }

  let { event, errors, message, submitLabel = 'Save event' }: Props = $props();
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
      if (result.type === 'success') toastStore.push('Timeline event saved.', 'success');
      await update();
    };
  }}
>
  <FormField label="Title" id="title" required error={errors?.title?.[0]}>
    <input id="title" name="title" type="text" required value={event?.title ?? ''} />
  </FormField>

  <FormField label="Description" id="description" required error={errors?.description?.[0]}>
    <textarea id="description" name="description" rows="3" required>{event?.description ?? ''}</textarea>
  </FormField>

  <FormField label="Type" id="type" required>
    <select id="type" name="type" required>
      {#each TIMELINE_EVENT_TYPES as type (type)}
        <option value={type} selected={type === event?.type}>{type}</option>
      {/each}
    </select>
  </FormField>

  <div class="row">
    <FormField label="Date" id="date" required>
      <input id="date" name="date" type="date" required value={toDateInputValue(event?.date)} />
    </FormField>
    <FormField label="End date" id="endDate" hint="Optional, for multi-month spans.">
      <input id="endDate" name="endDate" type="date" value={toDateInputValue(event?.endDate)} />
    </FormField>
  </div>

  <FormField label="Link" id="link" hint="Optional external URL.">
    <input id="link" name="link" type="url" value={event?.link ?? ''} />
  </FormField>

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
