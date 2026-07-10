import { Setting } from '../../models/index.js';

interface SeedContext {
  ogImageId: string;
}

export async function seedSettings({ ogImageId }: SeedContext): Promise<void> {
  await Setting.create({
    singletonKey: 'main',
    siteTitle: 'John Doe',
    tagline: 'Senior Software Engineer — Distributed Systems & Developer Platforms',
    footerText: `© ${new Date().getFullYear()} John Doe. Built with SvelteKit and Express.`,
    contactRecipientEmail: 'john.doe@example.com',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
      { platform: 'x', url: 'https://x.com/johndoe' },
      { platform: 'rss', url: '/articles/rss.xml' },
      { platform: 'email', url: 'mailto:john.doe@example.com' },
    ],
    seoDefaults: {
      title: 'John Doe — Senior Software Engineer',
      description:
        'Personal showcase of John Doe: projects, technical articles, publications, and career timeline.',
      ogImage: ogImageId,
      twitterHandle: '@johndoe',
    },
    homepageSections: [
      { type: 'hero', enabled: true, order: 0, limit: 1 },
      { type: 'featuredProjects', enabled: true, order: 1, limit: 3 },
      { type: 'featuredArticles', enabled: true, order: 2, limit: 3 },
      { type: 'timelinePreview', enabled: true, order: 3, limit: 5 },
      { type: 'publicationsPreview', enabled: true, order: 4, limit: 2 },
    ],
  });
}
