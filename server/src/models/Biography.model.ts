import { Schema, model, type InferSchemaType } from 'mongoose';
import { BACKGROUND_MEDIA_TYPES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const seoSchema = new Schema(
  {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 160 },
    ogImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { _id: false },
);

const backgroundSchema = new Schema(
  {
    type: { type: String, enum: BACKGROUND_MEDIA_TYPES, default: 'none' },
    media: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { _id: false },
);

/**
 * Singleton document — see `services/singleton.service.ts`. The unique index
 * on `singletonKey` guarantees only one Biography can ever exist; there is
 * no "create" route, only `getOrCreate`/`update`.
 */
const biographySchema = new Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true, immutable: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    headline: { type: String, required: true, trim: true, maxlength: 200 },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    bioMarkdown: { type: String, required: true },
    avatar: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    location: { type: String, trim: true, maxlength: 120 },
    skills: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    background: { type: backgroundSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

biographySchema.plugin(toJSONPlugin);

export type BiographyDocument = InferSchemaType<typeof biographySchema>;
export const Biography = model('Biography', biographySchema);
