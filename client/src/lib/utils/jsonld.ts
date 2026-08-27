import type { Article, Biography } from '@portfolio/shared';

/** Builders for JSON-LD structured data, embedded via a <script type="application/ld+json"> tag. */

/**
 * Serializes a JSON-LD object for embedding inside a `<script>` tag via
 * `{@html}`. Escapes `<` so untrusted content (e.g. a title containing
 * `</script>`) can never break out of the script tag.
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personJsonLd(siteUrl: string, biography: Biography, avatarUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: biography.fullName,
    jobTitle: biography.headline,
    description: biography.summary,
    url: siteUrl,
    image: avatarUrl,
    address: biography.location ? { '@type': 'PostalAddress', addressLocality: biography.location } : undefined,
  };
}

export function articleJsonLd(siteUrl: string, article: Article, authorName: string, imageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: authorName },
    mainEntityOfPage: `${siteUrl}/articles/${article.slug}`,
  };
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(siteUrl: string, crumbs: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
