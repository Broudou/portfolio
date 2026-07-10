import { Schema, model, type InferSchemaType } from 'mongoose';
import { CONTENT_STATUSES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';
import { calculateReadingTimeMinutes } from '../services/readingTime.service.js';

const seoSchema = new Schema(
  {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 160 },
    ogImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
  },
  { _id: false },
);

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    contentMarkdown: { type: String, required: true },
    coverImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: CONTENT_STATUSES, default: 'draft' },
    publishedAt: { type: Date, default: null },
    readingTimeMinutes: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ title: 'text', excerpt: 'text', contentMarkdown: 'text' });
articleSchema.plugin(toJSONPlugin);

articleSchema.pre('save', function computeReadingTime(next) {
  if (this.isModified('contentMarkdown')) {
    this.readingTimeMinutes = calculateReadingTimeMinutes(this.contentMarkdown);
  }
  next();
});

export type ArticleDocument = InferSchemaType<typeof articleSchema>;
export const Article = model('Article', articleSchema);
