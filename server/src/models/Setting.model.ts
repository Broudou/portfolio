import { Schema, model, type InferSchemaType } from 'mongoose';
import { BACKGROUND_MEDIA_TYPES, HOMEPAGE_SECTION_TYPES, SOCIAL_PLATFORMS } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const socialLinkSchema = new Schema(
  {
    platform: { type: String, enum: SOCIAL_PLATFORMS, required: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const seoDefaultsSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 70 },
    description: { type: String, required: true, maxlength: 160 },
    ogImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    twitterHandle: { type: String, trim: true },
  },
  { _id: false },
);

const homepageSectionSchema = new Schema(
  {
    type: { type: String, enum: HOMEPAGE_SECTION_TYPES, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    limit: { type: Number, default: 3, min: 1, max: 20 },
  },
  { _id: false },
);

const homeBackgroundSchema = new Schema(
  {
    type: { type: String, enum: BACKGROUND_MEDIA_TYPES, default: 'none' },
    media: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { _id: false },
);

/** Singleton document — same `singletonKey` pattern as Biography. */
const settingSchema = new Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true, immutable: true },
    siteTitle: { type: String, required: true, trim: true, maxlength: 120 },
    tagline: { type: String, required: true, trim: true, maxlength: 200 },
    footerText: { type: String, required: true, trim: true, maxlength: 300 },
    contactRecipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    socialLinks: { type: [socialLinkSchema], default: [] },
    seoDefaults: { type: seoDefaultsSchema, required: true },
    homepageSections: { type: [homepageSectionSchema], default: [] },
    homeBackground: { type: homeBackgroundSchema, default: () => ({}) },
  },
  { timestamps: true },
);

settingSchema.plugin(toJSONPlugin);

export type SettingDocument = InferSchemaType<typeof settingSchema>;
export const Setting = model('Setting', settingSchema);
