<script lang="ts">
  interface Props {
    label?: string;
  }

  let { label = 'Loading…' }: Props = $props();
</script>

<span class="spinner" role="status" aria-live="polite">
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="none" stroke="var(--color-border)" stroke-width="3" />
    <path d="M10 2a8 8 0 0 1 8 8" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" />
  </svg>
  <span class="visually-hidden">{label}</span>
</span>

<style>
  .spinner svg {
    animation: spin 0.8s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner svg {
      animation-duration: 2s;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
