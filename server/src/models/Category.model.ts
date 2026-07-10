import { Schema, model, type InferSchemaType } from 'mongoose';
import { CATEGORY_APPLIES_TO } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 300 },
    appliesTo: { type: String, enum: CATEGORY_APPLIES_TO, default: 'both' },
  },
  { timestamps: true },
);

categorySchema.plugin(toJSONPlugin);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export const Category = model('Category', categorySchema);
