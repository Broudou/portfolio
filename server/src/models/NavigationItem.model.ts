import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const navigationItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 60 },
    path: { type: String, required: true, trim: true, maxlength: 200 },
    order: { type: Number, default: 0 },
    isExternal: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    openInNewTab: { type: Boolean, default: false },
  },
  { timestamps: true },
);

navigationItemSchema.index({ order: 1 });
navigationItemSchema.plugin(toJSONPlugin);

export type NavigationItemDocument = InferSchemaType<typeof navigationItemSchema>;
export const NavigationItem = model('NavigationItem', navigationItemSchema);
