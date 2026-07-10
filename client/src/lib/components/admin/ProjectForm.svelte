<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Category, Media, Project, Tag } from '@portfolio/shared';
  import FormField from './FormField.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';
  import MediaPicker from './MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';

  interface FormErrors {
    [key: string]: string[] | undefined;
  }

  interface Props {
    project?: Project;
    categories: Category[];
    tags: Tag[];
    media: Media[];
    errors?: FormErrors;
    message?: string;
    submitLabel?: string;
  }

  let { project, categories, tags, media, errors, message, submitLabel = 'Save project' }: Props = $props();

  let descriptionMarkdown = $state(project?.descriptionMarkdown ?? '');
  let coverImageId = $state<string | null>(populated(project?.coverImage)?.id ?? null);
  const selectedTagIds = $state<string[]>(
    (project?.tags ?? []).map((tag) => populated(tag)?.id).filter((id): id is string => Boolean(id)),
  );
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
      if (result.type === 'success') toastStore.push('Project saved.', 'success');
      await update();
    };
  }}
>
  <FormField label="Title" id="title" required error={errors?.title?.[0]}>
    <input id="title" name="title" type="text" required value={project?.title ?? ''} />
  </FormField>

  <FormField label="Slug" id="slug" hint="Leave blank to auto-generate from the title.">
    <input id="slug" name="slug" type="text" value={project?.slug ?? ''} />
  </FormField>

  <FormField label="Summary" id="summary" required error={errors?.summary?.[0]}>
    <textarea id="summary" name="summary" rows="2" required>{project?.summary ?? ''}</textarea>
  </FormField>

  <MediaPicker id="coverImage" label="Cover image" bind:value={coverImageId} {media} />

  <MarkdownEditor id="descriptionMarkdown" label="Description (Markdown)" bind:value={descriptionMarkdown} required />
  <input type="hidden" name="descriptionMarkdown" value={descriptionMarkdown} />

  <FormField label="Tech stack" id="techStack" hint="Comma-separated.">
    <input id="techStack" name="techStack" type="text" value={(project?.techStack ?? []).join(', ')} />
  </FormField>

  <FormField label="Role" id="role">
    <input id="role" name="role" type="text" value={project?.role ?? ''} />
  </FormField>

  <fieldset>
    <legend>Links</legend>
    <FormField label="Repository URL" id="repoUrl">
      <input id="repoUrl" name="repoUrl" type="url" value={project?.links.repoUrl ?? ''} />
    </FormField>
    <FormField label="Live URL" id="liveUrl">
      <input id="liveUrl" name="liveUrl" type="url" value={project?.links.liveUrl ?? ''} />
    </FormField>
    <FormField label="Case study URL" id="caseStudyUrl">
      <input id="caseStudyUrl" name="caseStudyUrl" type="url" value={project?.links.caseStudyUrl ?? ''} />
    </FormField>
  </fieldset>

  <FormField label="Category" id="category">
    <select id="category" name="category">
      <option value="">No category</option>
      {#each categories as category (category.id)}
        <option value={category.id} selected={category.id === populated(project?.category)?.id}>
          {category.name}
        </option>
      {/each}
    </select>
  </FormField>

  <FormField label="Tags" id="tags">
    <select id="tags" name="tags" multiple size={Math.min(6, tags.length || 1)}>
      {#each tags as tag (tag.id)}
        <option value={tag.id} selected={selectedTagIds.includes(tag.id)}>{tag.name}</option>
      {/each}
    </select>
  </FormField>

  <div class="row">
    <FormField label="Start date" id="startDate" required>
      <input id="startDate" name="startDate" type="date" required value={toDateInputValue(project?.startDate)} />
    </FormField>
    <FormField label="End date" id="endDate" hint="Leave blank if ongoing.">
      <input id="endDate" name="endDate" type="date" value={toDateInputValue(project?.endDate)} />
    </FormField>
    <FormField label="Order" id="order" hint="Lower numbers appear first.">
      <input id="order" name="order" type="number" value={project?.order ?? 0} />
    </FormField>
  </div>

  <div class="row">
    <label class="checkbox">
      <input type="checkbox" name="featured" checked={project?.featured ?? false} />
      Featured on homepage
    </label>
    <FormField label="Status" id="status">
      <select id="status" name="status">
        <option value="draft" selected={project?.status !== 'published'}>Draft</option>
        <option value="published" selected={project?.status === 'published'}>Published</option>
      </select>
    </FormField>
  </div>

  <fieldset>
    <legend>SEO</legend>
    <FormField label="SEO title override" id="seoTitle">
      <input id="seoTitle" name="seoTitle" type="text" value={project?.seo?.title ?? ''} />
    </FormField>
    <FormField label="SEO description override" id="seoDescription">
      <textarea id="seoDescription" name="seoDescription" rows="2">{project?.seo?.description ?? ''}</textarea>
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
