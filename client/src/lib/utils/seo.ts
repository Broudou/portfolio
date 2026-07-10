import type { Media, SeoDefaults, SeoMeta } from '@portfolio/shared';

export interface ResolvedSeo {
  title: string;
  description: string;
  ogImageUrl?: string;
  canonicalUrl: string;
  twitterHandle?: string;
}

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value;
}

function resolveImageUrl(siteUrl: string, image: Media | string | null | undefined): string | undefined {
  if (!image) return undefined;
  const path = isMedia(image) ? image.url : undefined;
  return path ? `${siteUrl}${path}` : undefined;
}

/**
 * Merges an entity's own SEO overrides with the site-wide defaults from
 * Settings, producing the final values every page's `<svelte:head>` uses.
 * Entity fields win when present; otherwise the site default is used.
 */
export function resolveSeo(
  siteUrl: string,
  path: string,
  defaults: SeoDefaults,
  overrides?: SeoMeta,
  fallbackTitle?: string,
  fallbackDescription?: string,
): ResolvedSeo {
  return {
    title: overrides?.title || fallbackTitle || defaults.title,
    description: overrides?.description || fallbackDescription || defaults.description,
    ogImageUrl: resolveImageUrl(siteUrl, overrides?.ogImage) ?? resolveImageUrl(siteUrl, defaults.ogImage),
    canonicalUrl: `${siteUrl}${path}`,
    twitterHandle: defaults.twitterHandle,
  };
}
