import type { HydratedDocument } from 'mongoose';
import { User, type UserDocument } from '../../models/index.js';
import { hashPassword } from '../../services/auth.service.js';

export const SEED_ADMIN_EMAIL = 'nadia.voss@example.com';
export const SEED_ADMIN_PASSWORD = 'ChangeMe123!';

export async function seedAdminUser(): Promise<HydratedDocument<UserDocument>> {
  const passwordHash = await hashPassword(SEED_ADMIN_PASSWORD);
  return User.create({
    name: 'Nadia Voss',
    email: SEED_ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
  });
}
