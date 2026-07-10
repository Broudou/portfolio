import mongoose from 'mongoose';
import { connectDatabase } from '../db/connect.js';
import { logger } from '../utils/logger.js';
import {
  Article,
  Biography,
  Category,
  ContactMessage,
  Media,
  NavigationItem,
  Project,
  Publication,
  Setting,
  Tag,
  TimelineEvent,
  User,
} from '../models/index.js';
import { seedAdminUser, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from './data/user.seed.js';
import { seedMedia } from './data/media.seed.js';
import { seedCategories } from './data/categories.seed.js';
import { seedTags } from './data/tags.seed.js';
import { seedBiography } from './data/biography.seed.js';
import { seedProjects } from './data/projects.seed.js';
import { seedArticles } from './data/articles.seed.js';
import { seedNavigation } from './data/navigation.seed.js';
import { seedTimeline } from './data/timeline.seed.js';
import { seedPublications } from './data/publications.seed.js';
import { seedSettings } from './data/settings.seed.js';
import { seedContactMessages } from './data/contactMessages.seed.js';

const ALL_MODELS = [
  User,
  Media,
  Biography,
  Project,
  Article,
  Category,
  Tag,
  NavigationItem,
  Setting,
  TimelineEvent,
  Publication,
  ContactMessage,
];

/**
 * Seeds the database with a complete "John Doe" example for every model.
 * Idempotent by default: if a Setting document already exists, seeding is
 * skipped. Pass `force: true` to wipe every collection and reseed from
 * scratch (used by `npm run seed -- --force`).
 */
export async function runSeed({ force = false }: { force?: boolean } = {}): Promise<void> {
  const alreadySeeded = await Setting.exists({ singletonKey: 'main' });

  if (alreadySeeded && !force) {
    logger.info('Database already seeded, skipping. Pass --force to reseed from scratch.');
    return;
  }

  if (alreadySeeded && force) {
    logger.warn('Force flag set — dropping all seeded collections and reseeding.');
    await Promise.all(ALL_MODELS.map((model) => model.deleteMany({})));
  }

  logger.info('Seeding database with sample "John Doe" content...');

  const admin = await seedAdminUser();
  const { byKey: media } = await seedMedia(admin.id);
  const categories = await seedCategories();
  const tags = await seedTags();

  await seedBiography(media.avatar.id);
  await seedProjects({ categories, tags, media });
  await seedArticles({ authorId: admin.id, categories, tags, media });
  await seedNavigation();
  await seedTimeline();
  await seedPublications({ coverImageId: media['publication-conf-2023'].id });
  await seedSettings({ ogImageId: media['og-default'].id });
  await seedContactMessages();

  logger.info('Database seeded successfully.');
  logger.info(`Admin login — email: ${SEED_ADMIN_EMAIL} / password: ${SEED_ADMIN_PASSWORD}`);
  logger.warn('Change the seeded admin password immediately after first login.');
}

async function runAsCli(): Promise<void> {
  const force = process.argv.includes('--force');
  await connectDatabase();
  await runSeed({ force });
  await mongoose.disconnect();
  process.exit(0);
}

// Only run automatically when this file is executed directly (`npm run seed`),
// not when imported by `index.ts` as part of normal server bootstrap.
const entryPath = process.argv[1]?.replace(/\\/g, '/') ?? '';
const isDirectRun = entryPath.endsWith('seed/index.ts') || entryPath.endsWith('seed/index.js');
if (isDirectRun) {
  runAsCli().catch((error) => {
    logger.error({ err: error }, 'Seeding failed');
    process.exit(1);
  });
}
