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

const linksSchema = new Schema(
  {
    repoUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    caseStudyUrl: { type: String, trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    descriptionMarkdown: { type: String, required: true },
    coverImage: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    techStack: { type: [String], default: [] },
    role: { type: String, trim: true, maxlength: 120 },
    links: { type: linksSchema, default: () => ({}) },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    status: { type: String, enum: CONTENT_STATUSES, default: 'draft' },
    featured: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1, featured: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ title: 'text', summary: 'text' });
projectSchema.plugin(toJSONPlugin);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;
export const Project = model('Project', projectSchema);
