<script lang="ts">
  import type { TimelineEvent } from '@portfolio/shared';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { formatMonthYear } from '$lib/utils/date.js';

  interface Props {
    event: TimelineEvent;
  }

  let { event }: Props = $props();

  const TYPE_LABEL: Record<string, string> = {
    education: 'Education',
    work: 'Work',
    achievement: 'Achievement',
    project: 'Project',
    talk: 'Talk',
  };
</script>

<li class="timeline-item">
  <div class="marker" aria-hidden="true"></div>
  <div class="content">
    <p class="date">
      <time datetime={event.date}>{formatMonthYear(event.date)}</time>
      {#if event.endDate} — <time datetime={event.endDate}>{formatMonthYear(event.endDate)}</time>{/if}
    </p>
    <div class="heading">
      <h3>{event.title}</h3>
      <Badge variant="accent">{TYPE_LABEL[event.type] ?? event.type}</Badge>
    </div>
    <p class="description">{event.description}</p>
    {#if event.link}
      <a href={event.link} target="_blank" rel="noopener noreferrer">Learn more →</a>
    {/if}
  </div>
</li>

<style>
  .timeline-item {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: var(--space-5);
    position: relative;
    padding-bottom: var(--space-8);
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -8px;
    width: 2px;
    background: var(--color-border);
  }

  .timeline-item:last-child::before {
    display: none;
  }

  .marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-accent);
    margin-top: 4px;
  }

  .date {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  .heading {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
    margin-bottom: var(--space-2);
  }

  .heading h3 {
    margin: 0;
    font-size: var(--font-size-lg);
  }

  .description {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }
</style>
