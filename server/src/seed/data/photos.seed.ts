import fs from 'node:fs/promises';
import path from 'node:path';
import { Album, Media, Photo } from '../../models/index.js';
import { env } from '../../config/env.js';
import { slugify } from '../../services/slug.service.js';
import { generatePlaceholderSvg } from '../assets/generatePlaceholder.js';

interface AlbumSpec {
  title: string;
  description: string;
  background: string;
  accent: string;
  status: 'draft' | 'published';
  featured: boolean;
  photos: { caption: string }[];
}

/** Pastel/accent pairings pulled from the design token palette (tokens.css). */
const ALBUMS: AlbumSpec[] = [
  {
    title: 'Trail Running',
    description: 'Weekend miles on the ridge trails, rain or shine.',
    background: '#F0FDF4',
    accent: '#C2410C',
    status: 'published',
    featured: true,
    photos: [
      { caption: 'Sunrise start on the ridge loop.' },
      { caption: 'Fog rolling through the valley at mile six.' },
      { caption: 'Post-run coffee at the trailhead.' },
    ],
  },
  {
    title: 'Film Photography',
    description: '35mm shots from a summer of shooting on expired stock.',
    background: '#FFFBEB',
    accent: '#C2410C',
    status: 'published',
    featured: true,
    photos: [
      { caption: 'Kodak Gold, overexposed by a stop on purpose.' },
      { caption: 'Late afternoon light through the kitchen window.' },
      { caption: 'Self-portrait, first roll of the year.' },
      { caption: 'Contact sheet from the coast trip.' },
    ],
  },
  {
    title: 'Home Studio Pottery',
    description: 'Glaze tests and first attempts at the wheel.',
    background: '#FFF1F2',
    accent: '#C2410C',
    status: 'draft',
    featured: false,
    photos: [
      { caption: 'First bowl that survived the kiln.' },
      { caption: 'Testing a new celadon glaze recipe.' },
    ],
  },
];

export async function seedPhotos(uploadedBy: string): Promise<void> {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });

  for (const [albumIndex, spec] of ALBUMS.entries()) {
    const albumKey = slugify(spec.title);
    const coverFilename = `seed-album-${albumKey}-cover.svg`;
    const coverSvg = generatePlaceholderSvg({
      label: spec.title,
      background: spec.background,
      accent: spec.accent,
    });
    await fs.writeFile(path.join(env.UPLOAD_DIR, coverFilename), coverSvg, 'utf-8');
    const cover = await Media.create({
      filename: coverFilename,
      url: `/uploads/${coverFilename}`,
      mimeType: 'image/svg+xml',
      sizeBytes: Buffer.byteLength(coverSvg, 'utf-8'),
      altText: `Cover image for the ${spec.title} album`,
      width: 1200,
      height: 800,
      uploadedBy,
    });

    const album = await Album.create({
      title: spec.title,
      slug: albumKey,
      description: spec.description,
      cover: cover.id,
      status: spec.status,
      featured: spec.featured,
      order: albumIndex,
    });

    for (const [photoIndex, photoSpec] of spec.photos.entries()) {
      const photoFilename = `seed-album-${albumKey}-photo-${photoIndex + 1}.svg`;
      const photoSvg = generatePlaceholderSvg({
        label: `${spec.title} #${photoIndex + 1}`,
        background: spec.background,
        accent: spec.accent,
      });
      await fs.writeFile(path.join(env.UPLOAD_DIR, photoFilename), photoSvg, 'utf-8');
      const media = await Media.create({
        filename: photoFilename,
        url: `/uploads/${photoFilename}`,
        mimeType: 'image/svg+xml',
        sizeBytes: Buffer.byteLength(photoSvg, 'utf-8'),
        altText: photoSpec.caption,
        width: 1200,
        height: 800,
        uploadedBy,
      });

      await Photo.create({
        album: album.id,
        image: media.id,
        caption: photoSpec.caption,
        order: photoIndex,
      });
    }
  }
}
