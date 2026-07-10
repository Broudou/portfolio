<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Props {
    items: T[];
    getId: (item: T) => string;
    onReorder: (orderedIds: string[]) => void;
    row: Snippet<[T]>;
  }

  let { items, getId, onReorder, row }: Props = $props();

  /**
   * Reordering via "move up/down" buttons rather than drag-and-drop:
   * native HTML5 drag-and-drop is unreliable for keyboard and
   * screen-reader users, and this list is short enough that buttons are
   * just as fast to use.
   */
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    onReorder(reordered.map(getId));
  }
</script>

<ul class="reorderable-list">
  {#each items as item, index (getId(item))}
    <li>
      <div class="controls">
        <button type="button" onclick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
          ↑
        </button>
        <button
          type="button"
          onclick={() => move(index, 1)}
          disabled={index === items.length - 1}
          aria-label="Move down"
        >
          ↓
        </button>
      </div>
      <div class="row-content">{@render row(item)}</div>
    </li>
  {/each}
</ul>

<style>
  .reorderable-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  li {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  li:last-child {
    border-bottom: none;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .controls button {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    width: 24px;
    height: 20px;
    line-height: 1;
    font-size: var(--font-size-xs);
  }

  .controls button:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .controls button:disabled {
    opacity: 0.35;
  }

  .row-content {
    flex: 1;
  }
</style>
