import { Schema, model, type InferSchemaType } from 'mongoose';
import { ROLES } from '@portfolio/shared';
import { toJSONPlugin } from './plugins/toJSON.plugin.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'admin' },
    avatar: { type: Schema.Types.ObjectId, ref: 'Media', default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.plugin(toJSONPlugin);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
