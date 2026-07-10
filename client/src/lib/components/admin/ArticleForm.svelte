<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Article, Category, Media, Tag } from '@portfolio/shared';
  import FormField from './FormField.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';
  import MediaPicker from './MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';

  interface FormErrors {
    [key: string]: string[] | undefined;
  }

  interface Props {
    article?: Article;
    categories: Category[];
    tags: Tag[];
    media: Media[];
    errors?: FormErrors;
    message?: string;
    submitLabel?: string;
  }

  let { article, categories, tags, media, errors, message, submitLabel = 'Save article' }: Props = $props();

  let contentMarkdown = $state(article?.contentMarkdown ?? '');
  let coverImageId = $state<string | null>(populated(article?.coverImage)?.id ?? null);
  const selectedTagIds = $state<string[]>(
    (article?.tags ?? []).map((tag) => populated(tag)?.id).filter((id): id is string => Boolean(id)),
  );
  let submitting = $state(false);
</script>

<form
  method="POST"
  use:enhance={() => {
    submitting = true;
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') toastStore.push('Article saved.', 'success');
      await update();
    };
  }}
>
  <FormField label="Title" id="title" required error={errors?.title?.[0]}>
    <input id="title" name="title" type="text" required value={article?.title ?? ''} />
  </FormField>

  <FormField label="Slug" id="slug" hint="Leave blank to auto-generate from the title.">
    <input id="slug" name="slug" type="text" value={article?.slug ?? ''} />
  </FormField>

  <FormField label="Excerpt" id="excerpt" required error={errors?.excerpt?.[0]}>
    <textarea id="excerpt" name="excerpt" rows="2" required>{article?.excerpt ?? ''}</textarea>
  </FormField>

  <MediaPicker id="coverImage" label="Cover image" bind:value={coverImageId} {media} />

  <MarkdownEditor id="contentMarkdown" label="Content (Markdown)" bind:value={contentMarkdown} required rows={24} />
  <input type="hidden" name="contentMarkdown" value={contentMarkdown} />

  <FormField label="Category" id="category">
    <select id="category" name="category">
      <option value="">No category</option>
      {#each categories as category (category.id)}
        <option value={category.id} selected={category.id === populated(article?.category)?.id}>
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
    <label class="checkbox">
      <input type="checkbox" name="featured" checked={article?.featured ?? false} />
      Featured on homepage
    </label>
    <FormField label="Status" id="status">
      <select id="status" name="status">
        <option value="draft" selected={article?.status !== 'published'}>Draft</option>
        <option value="published" selected={article?.status === 'published'}>Published</option>
      </select>
    </FormField>
  </div>

  <fieldset>
    <legend>SEO</legend>
    <FormField label="SEO title override" id="seoTitle">
      <input id="seoTitle" name="seoTitle" type="text" value={article?.seo?.title ?? ''} />
    </FormField>
    <FormField label="SEO description override" id="seoDescription">
      <textarea id="seoDescription" name="seoDescription" rows="2">{article?.seo?.description ?? ''}</textarea>
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
