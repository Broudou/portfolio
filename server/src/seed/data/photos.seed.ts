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
  photoCount: number;
}

/** Pastel/accent pairings pulled from the design token palette (tokens.css). */
const ALBUMS: AlbumSpec[] = [
  {
    title: 'Studio & Rehearsal',
    description: 'Behind the scenes of the modular rig, the tape deck, and late rehearsal nights.',
    background: '#F0FDF4',
    accent: '#C2410C',
    status: 'published',
    featured: true,
    photoCount: 3,
  },
  {
    title: 'Underneath — Install Documentation',
    description: 'Rigging speakers and contact mics inside the water tank ahead of opening night.',
    background: '#FFFBEB',
    accent: '#C2410C',
    status: 'published',
    featured: true,
    photoCount: 4,
  },
  {
    title: 'Sediment — Studio Process',
    description: 'Layering, sanding, and collage stages from the mixed-media panel series.',
    background: '#FFF1F2',
    accent: '#C2410C',
    status: 'draft',
    featured: false,
    photoCount: 2,
  },
];

export async function seedPhotos(uploadedBy: string): Promise<void> {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });

  for (const [albumIndex, spec] of ALBUMS.entries()) {
    const albumKey = slugify(spec.title);

    const album = await Album.create({
      title: spec.title,
      slug: albumKey,
      description: spec.description,
      status: spec.status,
      featured: spec.featured,
      order: albumIndex,
    });

    let coverImageId: string | null = null;

    for (let photoIndex = 0; photoIndex < spec.photoCount; photoIndex += 1) {
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
        altText: `${spec.title} photo ${photoIndex + 1}`,
        width: 1200,
        height: 800,
        uploadedBy,
      });

      await Photo.create({
        album: album.id,
        image: media.id,
        order: photoIndex,
      });

      if (photoIndex === 0) coverImageId = media.id;
    }

    if (coverImageId) {
      await Album.updateOne({ _id: album.id }, { $set: { cover: coverImageId } });
    }
  }
}
