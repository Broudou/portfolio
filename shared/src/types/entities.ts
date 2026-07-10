/**
 * Wire-shape interfaces for every persisted entity. These describe the JSON
 * that crosses the client <-> server boundary — ids are strings, dates are
 * ISO-8601 strings, and populated refs may appear either as a bare id string
 * or as the populated object depending on the endpoint (documented per-field
 * where it matters). Server-only fields (e.g. User.passwordHash) are
 * intentionally omitted; Mongoose documents carry more than what is exposed
 * here.
 */

import type {
  CategoryAppliesTo,
  ContentStatus,
  HomepageSectionType,
  PublicationType,
  Role,
  SocialPlatform,
  TimelineEventType,
} from '../constants/enums.js';

/** Base fields present on every persisted document. */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** SEO metadata block nested on content entities that render a public page. */
export interface SeoMeta {
  title?: string;
  description?: string;
  ogImage?: Media | string | null;
}

export interface Media extends BaseEntity {
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  width?: number;
  height?: number;
  uploadedBy: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  avatar?: Media | string | null;
  lastLoginAt?: string | null;
}

export interface Biography extends BaseEntity {
  fullName: string;
  headline: string;
  summary: string;
  bioMarkdown: string;
  avatar?: Media | string | null;
  location?: string;
  skills: string[];
  highlights: string[];
  seo?: SeoMeta;
}

export interface ProjectLinks {
  repoUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
}

export interface Project extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  descriptionMarkdown: string;
  coverImage?: Media | string | null;
  gallery: (Media | string)[];
  techStack: string[];
  role?: string;
  links: ProjectLinks;
  category?: Category | string | null;
  tags: (Tag | string)[];
  status: ContentStatus;
  featured: boolean;
  startDate: string;
  endDate?: string | null;
  order: number;
  seo?: SeoMeta;
}

export interface Article extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImage?: Media | string | null;
  category?: Category | string | null;
  tags: (Tag | string)[];
  author: User | string;
  status: ContentStatus;
  publishedAt?: string | null;
  readingTimeMinutes: number;
  featured: boolean;
  seo?: SeoMeta;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  appliesTo: CategoryAppliesTo;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
}

export interface NavigationItem extends BaseEntity {
  label: string;
  path: string;
  order: number;
  isExternal: boolean;
  isVisible: boolean;
  openInNewTab: boolean;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface HomepageSectionConfig {
  type: HomepageSectionType;
  enabled: boolean;
  order: number;
  limit: number;
}

export interface SeoDefaults {
  title: string;
  description: string;
  ogImage?: Media | string | null;
  twitterHandle?: string;
}

export interface Setting extends BaseEntity {
  siteTitle: string;
  tagline: string;
  footerText: string;
  contactRecipientEmail: string;
  socialLinks: SocialLink[];
  seoDefaults: SeoDefaults;
  homepageSections: HomepageSectionConfig[];
}

export interface TimelineEvent extends BaseEntity {
  title: string;
  description: string;
  date: string;
  endDate?: string | null;
  type: TimelineEventType;
  link?: string;
}

export interface Publication extends BaseEntity {
  title: string;
  type: PublicationType;
  venue: string;
  url?: string;
  date: string;
  description?: string;
  coAuthors: string[];
  slidesUrl?: string;
  coverImage?: Media | string | null;
}

export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string;
}
