import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    isRead: { type: Boolean, default: false },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ isRead: 1 });
contactMessageSchema.plugin(toJSONPlugin);

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema>;
export const ContactMessage = model('ContactMessage', contactMessageSchema);
