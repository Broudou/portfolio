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
  { key: 'avatar', label: 'Nadia Voss', background: '#F5F3FF', accent: '#C2410C', altText: 'Portrait placeholder for Nadia Voss' },
  { key: 'og-default', label: 'Nadia Voss', background: '#EFF6FF', accent: '#1C1917', altText: 'Default social share image for the site' },
  { key: 'project-tidal-drift', label: 'Tidal Drift', background: '#EFF6FF', accent: '#C2410C', altText: 'Cover image for the Tidal Drift album' },
  { key: 'project-underneath', label: 'Underneath', background: '#F0FDF4', accent: '#C2410C', altText: 'Cover image for the Underneath sound installation' },
  { key: 'project-nocturne-sessions', label: 'Nocturne Sessions', background: '#FFFBEB', accent: '#C2410C', altText: 'Cover image for the Nocturne Sessions performance series' },
  { key: 'project-sediment', label: 'Sediment', background: '#FFF1F2', accent: '#C2410C', altText: 'Cover image for the Sediment painting series' },
  { key: 'project-low-water', label: 'Low Water', background: '#F5F3FF', accent: '#C2410C', altText: 'Cover image for the Low Water album (in progress)' },
  { key: 'article-field-recordings', label: 'Field Recordings', background: '#EFF6FF', accent: '#1C1917', altText: 'Cover image for the article on building a field recording palette' },
  { key: 'article-scoring-for-a-room', label: 'Scoring for a Room', background: '#F0FDF4', accent: '#1C1917', altText: 'Cover image for the article on scoring the Underneath installation' },
  { key: 'article-nine-unrehearsed-shows', label: 'Nine Unrehearsed Shows', background: '#FFFBEB', accent: '#1C1917', altText: 'Cover image for the article on the Nocturne Sessions performance series' },
  { key: 'article-sediment-sketchbook', label: 'Sediment Sketchbook', background: '#FFF1F2', accent: '#1C1917', altText: 'Cover image for the sketchbook article on the Sediment series' },
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
