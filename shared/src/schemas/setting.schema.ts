import { z } from 'zod';
import { HOMEPAGE_SECTION_TYPES, SOCIAL_PLATFORMS } from '../constants/enums.js';
import { objectId } from './common.js';

const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string().min(1).max(300),
});

const seoDefaultsSchema = z.object({
  title: z.string().min(1).max(70),
  description: z.string().min(1).max(160),
  ogImage: objectId.nullish(),
  twitterHandle: z.string().max(60).optional(),
});

const homepageSectionSchema = z.object({
  type: z.enum(HOMEPAGE_SECTION_TYPES),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
  limit: z.number().int().min(1).max(20).default(3),
});

export const updateSettingSchema = z.object({
  siteTitle: z.string().min(1).max(120),
  tagline: z.string().min(1).max(200),
  footerText: z.string().min(1).max(300),
  contactRecipientEmail: z.string().email(),
  socialLinks: z.array(socialLinkSchema).default([]),
  seoDefaults: seoDefaultsSchema,
  homepageSections: z.array(homepageSectionSchema).default([]),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
