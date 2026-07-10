<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Not found</title>
</svelte:head>

<div class="container error-page">
  <p class="code">{page.status}</p>
  <h1>{page.error?.message ?? 'Something went wrong'}</h1>
  <a href="/">← Back to home</a>
</div>

<style>
  .error-page {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--space-4);
  }

  .code {
    font-family: var(--font-mono);
    color: var(--color-accent);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    margin: 0;
  }

  h1 {
    margin: 0;
  }

  a {
    margin-top: var(--space-4);
  }
</style>
