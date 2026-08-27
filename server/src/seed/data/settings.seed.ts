import { Setting } from '../../models/index.js';

interface SeedContext {
  ogImageId: string;
}

export async function seedSettings({ ogImageId }: SeedContext): Promise<void> {
  await Setting.create({
    singletonKey: 'main',
    siteTitle: 'Nadia Voss',
    tagline: 'Composer & Multidisciplinary Artist — Sound, Installation & Painting',
    footerText: `© ${new Date().getFullYear()} Nadia Voss. Built with SvelteKit and Express.`,
    contactRecipientEmail: 'nadia.voss@example.com',
    socialLinks: [
      { platform: 'x', url: 'https://x.com/nadiavoss' },
      { platform: 'mastodon', url: 'https://mastodon.social/@nadiavoss' },
      { platform: 'rss', url: '/articles/rss.xml' },
      { platform: 'email', url: 'mailto:nadia.voss@example.com' },
    ],
    seoDefaults: {
      title: 'Nadia Voss — Composer & Multidisciplinary Artist',
      description:
        'Personal showcase of Nadia Voss: music, sound installations, visual art, and writing on process.',
      ogImage: ogImageId,
      twitterHandle: '@nadiavoss',
    },
    homepageSections: [
      { type: 'featuredProjects', enabled: true, order: 0, limit: 3 },
      { type: 'featuredArticles', enabled: true, order: 1, limit: 3 },
      { type: 'photos', enabled: true, order: 2, limit: 3 },
    ],
  });
}
