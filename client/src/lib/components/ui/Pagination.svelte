<script lang="ts">
  import type { PaginationMeta } from '@portfolio/shared';

  interface Props {
    meta: PaginationMeta;
    buildHref: (page: number) => string;
  }

  let { meta, buildHref }: Props = $props();

  const pages = $derived(Array.from({ length: meta.totalPages }, (_, i) => i + 1));
</script>

{#if meta.totalPages > 1}
  <nav aria-label="Pagination" class="pagination">
    <a
      href={buildHref(Math.max(1, meta.page - 1))}
      aria-disabled={meta.page === 1}
      class="step"
    >
      ← Previous
    </a>

    <ul>
      {#each pages as page (page)}
        <li>
          <a href={buildHref(page)} aria-current={page === meta.page ? 'page' : undefined}>
            {page}
          </a>
        </li>
      {/each}
    </ul>

    <a
      href={buildHref(Math.min(meta.totalPages, meta.page + 1))}
      aria-disabled={meta.page === meta.totalPages}
      class="step"
    >
      Next →
    </a>
  </nav>
{/if}

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-5);
    margin-top: var(--space-8);
    flex-wrap: wrap;
  }

  .pagination ul {
    display: flex;
    gap: var(--space-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .pagination a {
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
  }

  .pagination a:hover {
    color: var(--color-accent);
  }

  .pagination a[aria-current='page'] {
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
  }

  .step[aria-disabled='true'] {
    opacity: 0.4;
    pointer-events: none;
  }
</style>
