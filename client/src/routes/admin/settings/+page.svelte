<script lang="ts">
  import { enhance } from '$app/forms';
  import { SOCIAL_PLATFORMS, HOMEPAGE_SECTION_TYPES } from '@portfolio/shared';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import FormField from '$lib/components/admin/FormField.svelte';
  import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { populated } from '$lib/utils/populated.js';
  import type { PageData } from './$types.js';
  import type { FormResult } from '$lib/types/formResult.js';

  interface Props {
    data: PageData;
    form: FormResult | null;
  }

  let { data, form }: Props = $props();
  let saving = $state(false);

  let homeBackgroundType = $state(data.settings.homeBackground.type);
  let homeBackgroundMediaId = $state<string | null>(populated(data.settings.homeBackground.media)?.id ?? null);

  const PLATFORM_LABEL: Record<string, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    x: 'X (Twitter)',
    mastodon: 'Mastodon',
    rss: 'RSS feed',
    email: 'Email (mailto:)',
  };

  const SECTION_LABEL: Record<string, string> = {
    featuredProjects: 'Featured projects',
    featuredArticles: 'Featured articles',
    photos: 'Photo albums',
  };

  function socialUrl(platform: string): string {
    return data.settings.socialLinks.find((link) => link.platform === platform)?.url ?? '';
  }

  function section(type: string) {
    return (
      data.settings.homepageSections.find((s) => s.type === type) ?? {
        enabled: true,
        order: 0,
        limit: 3,
      }
    );
  }
</script>

<AdminHeader title="Settings" user={data.user} />

<div class="admin-body">
  <form
    method="POST"
    use:enhance={() => {
      saving = true;
      return async ({ result, update }) => {
        saving = false;
        if (result.type === 'success') toastStore.push('Settings saved.', 'success');
        await update();
      };
    }}
  >
    <fieldset>
      <legend>Site</legend>
      <FormField label="Site title" id="siteTitle" required>
        <input id="siteTitle" name="siteTitle" type="text" required value={data.settings.siteTitle} />
      </FormField>
      <FormField label="Tagline" id="tagline" required>
        <input id="tagline" name="tagline" type="text" required value={data.settings.tagline} />
      </FormField>
      <FormField label="Footer text" id="footerText" required>
        <input id="footerText" name="footerText" type="text" required value={data.settings.footerText} />
      </FormField>
      <FormField label="Contact recipient email" id="contactRecipientEmail" required hint="Where contact form submissions are (optionally) emailed.">
        <input
          id="contactRecipientEmail"
          name="contactRecipientEmail"
          type="email"
          required
          value={data.settings.contactRecipientEmail}
        />
      </FormField>
    </fieldset>

    <fieldset>
      <legend>Social links</legend>
      {#each SOCIAL_PLATFORMS as platform (platform)}
        <FormField label={PLATFORM_LABEL[platform]} id="social_{platform}">
          <input id="social_{platform}" name="social_{platform}" type="text" value={socialUrl(platform)} />
        </FormField>
      {/each}
    </fieldset>

    <fieldset>
      <legend>SEO defaults</legend>
      <FormField label="Default SEO title" id="seoTitle" required>
        <input id="seoTitle" name="seoTitle" type="text" required value={data.settings.seoDefaults.title} />
      </FormField>
      <FormField label="Default SEO description" id="seoDescription" required>
        <textarea id="seoDescription" name="seoDescription" rows="2" required>{data.settings.seoDefaults.description}</textarea>
      </FormField>
      <FormField label="Twitter handle" id="twitterHandle">
        <input id="twitterHandle" name="twitterHandle" type="text" value={data.settings.seoDefaults.twitterHandle ?? ''} />
      </FormField>
    </fieldset>

    <fieldset>
      <legend>Homepage sections</legend>
      {#each HOMEPAGE_SECTION_TYPES as type, index (type)}
        {@const current = section(type)}
        <div class="section-row">
          <label class="enabled">
            <input
              type="checkbox"
              name="section_{type}_enabled"
              checked={current.enabled}
            />
            {SECTION_LABEL[type]}
          </label>
          <label class="small">
            Order
            <input type="number" name="section_{type}_order" value={current.order ?? index} min="0" />
          </label>
          <label class="small">
            Limit
            <input type="number" name="section_{type}_limit" value={current.limit ?? 3} min="1" max="20" />
          </label>
        </div>
      {/each}
    </fieldset>

    <fieldset>
      <legend>Home background</legend>
      <FormField label="Background type" id="homeBackgroundType" hint="Shown as a hero banner behind the top bar on the homepage.">
        <select id="homeBackgroundType" name="homeBackgroundType" bind:value={homeBackgroundType}>
          <option value="none">None</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </FormField>
      {#if homeBackgroundType !== 'none'}
        <MediaPicker
          id="homeBackgroundMedia"
          label={homeBackgroundType === 'video' ? 'Background video' : 'Background image'}
          bind:value={homeBackgroundMediaId}
          media={data.media}
          accept={homeBackgroundType === 'video' ? 'video/*' : 'image/*'}
          maxSizeMB={homeBackgroundType === 'video' ? 60 : 5}
        />
      {/if}
    </fieldset>

    {#if form?.message}<p class="error">{form.message}</p>{/if}

    <button type="submit" class="save" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
  </form>
</div>

<style>
  .admin-body {
    padding: var(--space-6);
    max-width: 720px;
  }

  fieldset {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-5);
    margin: 0 0 var(--space-6);
  }

  legend {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    padding-inline: var(--space-2);
  }

  .section-row {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .section-row:last-child {
    border-bottom: none;
  }

  .enabled {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
  }

  .small {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .small input {
    width: 64px;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
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
