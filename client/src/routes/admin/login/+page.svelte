<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { form }: Props = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Admin login</title>
</svelte:head>

<div class="login-page">
  <form
    method="POST"
    class="login-form"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        submitting = false;
        await update();
      };
    }}
  >
    <h1>Admin login</h1>
    <p class="subtitle">Sign in to manage this site's content.</p>

    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required autocomplete="username" value={form?.email ?? ''} />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required autocomplete="current-password" />
    </div>

    {#if form?.errors?.email}<p class="error">{form.errors.email[0]}</p>{/if}
    {#if form?.errors?.password}<p class="error">{form.errors.password[0]}</p>{/if}
    {#if form?.message}<p class="error">{form.message}</p>{/if}

    <button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
  </form>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5);
    background: var(--color-surface);
  }

  .login-form {
    width: 100%;
    max-width: 360px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-7);
    box-shadow: var(--shadow-md);
  }

  h1 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-2);
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-6);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  input {
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .error {
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin: 0 0 var(--space-3);
  }

  button {
    width: 100%;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-medium);
    margin-top: var(--space-2);
  }

  button:hover {
    background: var(--color-accent);
  }
</style>
