/**
 * Enumerations shared by the API and the SvelteKit client, kept as string
 * union types (not TS `enum`) so they serialize identically over JSON and
 * work directly as zod `z.enum()` inputs.
 */

export const ROLES = ['admin', 'editor'] as const;
export type Role = (typeof ROLES)[number];

export const CONTENT_STATUSES = ['draft', 'published'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CATEGORY_APPLIES_TO = ['project', 'article', 'both'] as const;
export type CategoryAppliesTo = (typeof CATEGORY_APPLIES_TO)[number];

export const HOMEPAGE_SECTION_TYPES = [
  'featuredProjects',
  'featuredArticles',
  'photos',
] as const;
export type HomepageSectionType = (typeof HOMEPAGE_SECTION_TYPES)[number];

export const SOCIAL_PLATFORMS = ['github', 'linkedin', 'x', 'mastodon', 'rss', 'email'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const BACKGROUND_MEDIA_TYPES = ['none', 'image', 'video'] as const;
export type BackgroundMediaType = (typeof BACKGROUND_MEDIA_TYPES)[number];
