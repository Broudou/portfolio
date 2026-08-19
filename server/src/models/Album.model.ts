import { Schema, model, type InferSchemaType } from 'mongoose';
import { CONTENT_STATUSES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const seoSchema = new Schema(
  {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 160 },
    ogImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { _id: false },
);

const albumSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 600 },
    cover: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    status: { type: String, enum: CONTENT_STATUSES, default: 'draft' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

albumSchema.index({ status: 1, featured: 1 });

albumSchema.plugin(toJSONPlugin);

export type AlbumDocument = InferSchemaType<typeof albumSchema>;
export const Album = model('Album', albumSchema);
