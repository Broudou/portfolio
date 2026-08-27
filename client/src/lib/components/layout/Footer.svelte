<script lang="ts">
  import type { SocialLink } from '@portfolio/shared';

  interface Props {
    footerText: string;
    socialLinks: SocialLink[];
    hasBackground?: boolean;
  }

  let { footerText, socialLinks, hasBackground = false }: Props = $props();

  const PLATFORM_LABEL: Record<string, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    x: 'X (Twitter)',
    mastodon: 'Mastodon',
    rss: 'RSS Feed',
    email: 'Email',
  };
</script>

<footer class="site-footer" class:has-background={hasBackground}>
  <div class="container inner">
    <p class="footer-text">{footerText}</p>

    {#if socialLinks.length > 0}
      <ul class="social-links" aria-label="Social links">
        {#each socialLinks as link (link.platform)}
          <li>
            <a href={link.url} target={link.platform === 'email' ? undefined : '_blank'} rel="noopener noreferrer">
              {PLATFORM_LABEL[link.platform] ?? link.platform}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--color-text-primary);
    margin-top: var(--space-9);
  }

  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-block: var(--space-6);
  }

  .footer-text {
    margin: 0;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

  .has-background .footer-text {
    color: #ffffff;
  }

  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .social-links a {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    transition: color var(--duration-base) var(--easing-standard);
  }

  .has-background .social-links a {
    color: #ffffff;
  }

  .social-links a:hover {
    color: var(--color-accent);
  }
</style>
