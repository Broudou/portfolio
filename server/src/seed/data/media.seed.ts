import fs from 'node:fs/promises';
import path from 'node:path';
import type { HydratedDocument } from 'mongoose';
import { Media, type MediaDocument } from '../../models/index.js';
import { env } from '../../config/env.js';
import { generatePlaceholderSvg } from '../assets/generatePlaceholder.js';

interface PlaceholderSpec {
  key: string;
  label: string;
  background: string;
  accent: string;
  altText: string;
}

/** Pastel/accent pairings pulled from the design token palette (tokens.css). */
const SPECS: PlaceholderSpec[] = [
  { key: 'avatar', label: 'John Doe', background: '#F5F3FF', accent: '#C2410C', altText: 'Portrait placeholder for John Doe' },
  { key: 'og-default', label: 'John Doe', background: '#EFF6FF', accent: '#1C1917', altText: 'Default social share image for the site' },
  { key: 'project-observability', label: 'Observability Platform', background: '#EFF6FF', accent: '#C2410C', altText: 'Cover image for the Observability Platform project' },
  { key: 'project-edge-cache', label: 'Edge Cache Router', background: '#F0FDF4', accent: '#C2410C', altText: 'Cover image for the Edge Cache Router project' },
  { key: 'project-taskflow', label: 'TaskFlow API', background: '#FFFBEB', accent: '#C2410C', altText: 'Cover image for the TaskFlow API project' },
  { key: 'project-designsystem', label: 'Design System Kit', background: '#FFF1F2', accent: '#C2410C', altText: 'Cover image for the Design System Kit project' },
  { key: 'project-migrator', label: 'Schema Migrator CLI', background: '#F5F3FF', accent: '#C2410C', altText: 'Cover image for the Schema Migrator CLI project' },
  { key: 'article-distributed-tracing', label: 'Distributed Tracing', background: '#EFF6FF', accent: '#1C1917', altText: 'Cover image for the article on distributed tracing' },
  { key: 'article-typed-apis', label: 'Typed APIs', background: '#F0FDF4', accent: '#1C1917', altText: 'Cover image for the article on end-to-end type safety' },
  { key: 'article-database-indexing', label: 'Database Indexing', background: '#FFFBEB', accent: '#1C1917', altText: 'Cover image for the article on database indexing' },
  { key: 'article-svelte-ssr', label: 'SvelteKit SSR', background: '#FFF1F2', accent: '#1C1917', altText: 'Cover image for the article on SvelteKit rendering' },
  { key: 'publication-conf-2023', label: 'Conference Talk', background: '#F5F3FF', accent: '#C2410C', altText: 'Cover image for a conference talk' },
];

export interface SeededMedia {
  byKey: Record<string, HydratedDocument<MediaDocument>>;
}

export async function seedMedia(uploadedBy: string): Promise<SeededMedia> {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });

  const byKey: Record<string, HydratedDocument<MediaDocument>> = {};

  for (const spec of SPECS) {
    const filename = `seed-${spec.key}.svg`;
    const svg = generatePlaceholderSvg({ label: spec.label, background: spec.background, accent: spec.accent });
    await fs.writeFile(path.join(env.UPLOAD_DIR, filename), svg, 'utf-8');

    const media = await Media.create({
      filename,
      url: `/uploads/${filename}`,
      mimeType: 'image/svg+xml',
      sizeBytes: Buffer.byteLength(svg, 'utf-8'),
      altText: spec.altText,
      width: 1200,
      height: 800,
      uploadedBy,
    });
    byKey[spec.key] = media;
  }

  return { byKey };
}
