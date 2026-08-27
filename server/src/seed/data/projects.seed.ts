import type { HydratedDocument } from 'mongoose';
import { Project } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';
import type { CategoryDocument } from '../../models/Category.model.js';
import type { TagDocument } from '../../models/Tag.model.js';

interface SeedContext {
  categories: Record<string, HydratedDocument<CategoryDocument>>;
  tags: Record<string, HydratedDocument<TagDocument>>;
  media: Record<string, { id: string }>;
}

export async function seedProjects(ctx: SeedContext): Promise<void> {
  const { categories, tags, media } = ctx;

  const projects = [
    {
      title: 'Tidal Drift',
      summary:
        'A seven-track ambient album built from processed field recordings taken along the Atlantic coast over two winters.',
      descriptionMarkdown: `## Starting point

I wanted an album that didn't feel composed so much as excavated — something
built from the actual sound of a place rather than instruments trying to
evoke it. Over two winters I recorded tide pools, harbor buoys, and wind
against cliff faces with a pair of hydrophones and a shotgun mic.

## Process

Each track started as a single long-form recording, stretched and layered in
the modular rig until the source material was barely recognizable. Melodic
material was added last, played sparingly enough that the field recordings
stayed the foreground rather than the backdrop.

## Release

- Released digitally and on cassette through a small ambient label
- Featured on three ambient/embient-adjacent radio shows in its first month
- The title track was licensed for a short documentary film`,
      category: categories.Music.id,
      tagNames: ['Ambient', 'Modular Synth', 'Field Recording'],
      coverImage: media['project-tidal-drift'].id,
      techStack: ['Eurorack', 'Ableton Live', 'Field Recorder', 'Hydrophones'],
      role: 'Composer & Producer',
      links: { liveUrl: 'https://example-label.bandcamp.com/album/tidal-drift' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2023-11-01'),
      endDate: new Date('2025-03-10'),
      order: 0,
    },
    {
      title: 'Underneath',
      summary:
        'A four-channel sound installation for a disused water tank, commissioned for a regional arts festival.',
      descriptionMarkdown: `## The space

The commission was a decommissioned water tank — a 12-meter concrete cylinder
with a natural reverb tail of nearly nine seconds. Any piece for the space
had to work with that decay, not fight it.

## What I built

A four-channel piece for contact mics, resonant objects, and slowly shifting
granular textures, triggered and spatialized in real time by a Max/MSP patch
responding to footstep vibration picked up through the floor.

\`\`\`
[contact mic] -> [envelope follower] -> [grain density] -> [4ch spatializer]
\`\`\`

## Reception

- Ran for three weeks, roughly 40 minutes of looping variation
- Drew over 2,000 visitors across the festival run
- Reviewed as a highlight of the festival's sound art program`,
      category: categories['Sound Installation'].id,
      tagNames: ['Installation', 'Field Recording', 'Sound Design'],
      coverImage: media['project-underneath'].id,
      techStack: ['Max/MSP', 'Contact Mics', 'Multichannel Speakers'],
      role: 'Sound Artist',
      links: { caseStudyUrl: 'https://example-artsfest.org/underneath' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2022-05-01'),
      endDate: new Date('2022-09-15'),
      order: 1,
    },
    {
      title: 'Nocturne Sessions',
      summary: 'A recurring series of improvised, unrehearsed collaborative performances with rotating guest musicians.',
      descriptionMarkdown: `## Premise

Nocturne Sessions is a monthly late-night performance series: one guest
musician, no rehearsal, no setlist. We meet an hour before doors, agree on a
rough shape for the evening, and improvise the rest live in front of an
audience of about sixty.

## Why unrehearsed

Removing rehearsal forces genuine listening on stage instead of executing a
plan. Some nights don't work. The ones that do are usually the strongest
material either of us makes all year.

## Run so far

Nine sessions completed with collaborators spanning modular synthesis, upright
bass, and voice. Selected recordings from the series are released quarterly
as a "Sessions" tape.`,
      category: categories.Performance.id,
      tagNames: ['Improvisation', 'Live Performance', 'Collaboration'],
      coverImage: media['project-nocturne-sessions'].id,
      techStack: ['Modular Synth', 'Multitrack Field Recorder'],
      role: 'Curator & Performer',
      links: { liveUrl: '' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2024-01-10'),
      order: 2,
    },
    {
      title: 'Sediment',
      summary: 'A mixed-media painting series exploring erosion and layering, shown in a group exhibition.',
      descriptionMarkdown: `## Concept

Sediment grew out of the same coastal recording trips that fed Tidal Drift —
this time translated into paint, sand, and salvaged paper instead of sound.
Each panel is built in layers that are partially sanded back before the next
is applied, so earlier marks stay visible through the surface.

## Materials

Acrylic and raw pigment on wood panel, with sand and torn paper collaged into
the wet ground. Six panels in total, ranging from 40x40cm to 100x140cm.

## Exhibition

Shown as part of a five-artist group exhibition on coastal landscape, running
six weeks at a regional gallery.`,
      category: categories['Visual Art'].id,
      tagNames: ['Painting', 'Mixed Media'],
      coverImage: media['project-sediment'].id,
      techStack: ['Acrylic', 'Raw Pigment', 'Wood Panel'],
      role: 'Artist',
      links: {},
      status: 'published' as const,
      featured: false,
      startDate: new Date('2021-04-01'),
      endDate: new Date('2021-10-01'),
      order: 3,
    },
    {
      title: 'Low Water (working title)',
      summary: 'A follow-up album exploring similar coastal source material through a more rhythmic, percussive lens.',
      descriptionMarkdown: `## Status: in progress

The follow-up to Tidal Drift, built from a new batch of recordings gathered
at low tide rather than the open water. This time the focus is rhythm —
dripping, cracking, and shifting stone — rather than sustained drone.

Still early. Expect the direction to shift before anything is finalized.`,
      category: categories.Music.id,
      tagNames: ['Field Recording', 'Sound Design'],
      coverImage: media['project-low-water'].id,
      techStack: ['Field Recorder', 'Ableton Live'],
      role: 'Composer & Producer',
      links: {},
      status: 'draft' as const,
      featured: false,
      startDate: new Date('2026-02-01'),
      order: 4,
    },
  ];

  for (const project of projects) {
    const { tagNames, ...rest } = project;
    await Project.create({
      ...rest,
      slug: slugify(project.title),
      tags: tagNames.map((name) => tags[name]?.id).filter(Boolean),
    });
  }
}
