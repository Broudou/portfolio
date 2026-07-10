<script lang="ts">
  import type { Category, Tag } from '@portfolio/shared';

  interface Props {
    action: string;
    categories: Category[];
    tags: Tag[];
    selectedCategory?: string;
    selectedTag?: string;
    searchQuery?: string;
    showSearch?: boolean;
  }

  let {
    action,
    categories,
    tags,
    selectedCategory = '',
    selectedTag = '',
    searchQuery = '',
    showSearch = false,
  }: Props = $props();
</script>

<form method="GET" {action} class="filter-bar" role="search">
  {#if showSearch}
    <div class="field">
      <label for="filter-q" class="visually-hidden">Search</label>
      <input id="filter-q" type="search" name="q" placeholder="Search…" value={searchQuery} />
    </div>
  {/if}

  {#if categories.length > 0}
    <div class="field">
      <label for="filter-category" class="visually-hidden">Category</label>
      <select id="filter-category" name="category">
        <option value="">All categories</option>
        {#each categories as category (category.id)}
          <option value={category.id} selected={category.id === selectedCategory}>{category.name}</option>
        {/each}
      </select>
    </div>
  {/if}

  {#if tags.length > 0}
    <div class="field">
      <label for="filter-tag" class="visually-hidden">Tag</label>
      <select id="filter-tag" name="tag">
        <option value="">All tags</option>
        {#each tags as tag (tag.id)}
          <option value={tag.id} selected={tag.id === selectedTag}>{tag.name}</option>
        {/each}
      </select>
    </div>
  {/if}

  <button type="submit" class="apply">Filter</button>
</form>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    margin-bottom: var(--space-7);
  }

  .field {
    flex: 1 1 160px;
  }

  input,
  select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
  }

  .apply {
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-text-primary);
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
  }

  .apply:hover {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }
</style>
