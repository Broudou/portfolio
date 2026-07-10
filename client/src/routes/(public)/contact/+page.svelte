<script lang="ts">
  import { page } from '$app/state';
  import { enhance } from '$app/forms';
  import SeoHead from '$lib/components/layout/SeoHead.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { resolveSeo } from '$lib/utils/seo.js';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();

  const siteUrl = $derived(page.url.origin);
  const seo = $derived(
    resolveSeo(siteUrl, '/contact', data.settings.seoDefaults, undefined, 'Contact', "Get in touch — I'm happy to hear about interesting problems, talks, or collaborations."),
  );

  let submitting = $state(false);
</script>

<SeoHead title={seo.title} description={seo.description} canonicalUrl={seo.canonicalUrl} ogImageUrl={seo.ogImageUrl} />

<div class="container page">
  <header class="page-header">
    <h1>Contact</h1>
    <p>Have a question, an interesting problem, or a speaking invitation? Send a message below.</p>
  </header>

  {#if form?.success}
    <div class="success" role="status">Thanks — your message has been sent.</div>
  {:else}
    <form
      method="POST"
      class="contact-form"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          submitting = false;
          await update();
        };
      }}
    >
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" required value={form?.values?.name ?? ''} />
        {#if form?.errors?.name}<p class="error">{form.errors.name[0]}</p>{/if}
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required value={form?.values?.email ?? ''} />
        {#if form?.errors?.email}<p class="error">{form.errors.email[0]}</p>{/if}
      </div>

      <div class="field">
        <label for="subject">Subject</label>
        <input id="subject" name="subject" type="text" required value={form?.values?.subject ?? ''} />
        {#if form?.errors?.subject}<p class="error">{form.errors.subject[0]}</p>{/if}
      </div>

      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="6" required>{form?.values?.message ?? ''}</textarea>
        {#if form?.errors?.message}<p class="error">{form.errors.message[0]}</p>{/if}
      </div>

      <!-- Honeypot: hidden from real users, bots tend to fill every field. -->
      <div class="honeypot" aria-hidden="true">
        <label for="website">Website</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
      </div>

      {#if form?.message}<p class="error">{form.message}</p>{/if}

      <Button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</Button>
    </form>
  {/if}
</div>

<style>
  .page {
    padding-block: var(--space-8) var(--space-9);
    max-width: var(--prose-max-width);
    margin-inline: auto;
  }

  .page-header {
    margin-bottom: var(--space-7);
  }

  .page-header p {
    color: var(--color-text-secondary);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  label {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
  }

  input,
  textarea {
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: inherit;
  }

  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }

  .error {
    color: var(--color-danger);
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .success {
    background: var(--color-pastel-green);
    border-radius: var(--radius-md);
    padding: var(--space-5);
    font-weight: var(--font-weight-medium);
  }

  .honeypot {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
</style>
