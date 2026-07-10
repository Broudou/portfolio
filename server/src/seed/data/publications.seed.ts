import { Publication } from '../../models/index.js';

interface SeedContext {
  coverImageId: string;
}

export async function seedPublications({ coverImageId }: SeedContext): Promise<void> {
  await Publication.insertMany([
    {
      title: 'Tracing Without the Ceremony',
      type: 'talk',
      venue: 'Backend Engineering Meetup, Berlin',
      url: 'https://example.com/talks/tracing-without-ceremony',
      date: new Date('2021-05-14'),
      description:
        'A pragmatic, incremental approach to adopting distributed tracing without a six-month platform project.',
      coAuthors: [],
      slidesUrl: 'https://example.com/slides/tracing-without-ceremony.pdf',
      coverImage: coverImageId,
    },
    {
      title: 'Practical Distributed Tracing',
      type: 'publication',
      venue: 'Internal Engineering Journal, Northwind Cloud',
      date: new Date('2024-03-01'),
      description:
        'A written deep-dive on incremental tracing adoption, covering propagation, sampling strategy, and storage trade-offs.',
      coAuthors: ['Priya Shah'],
    },
    {
      title: 'Zero-Downtime Schema Migrations at Scale',
      type: 'talk',
      venue: 'Regional Systems Conference',
      url: 'https://example.com/talks/zero-downtime-migrations',
      date: new Date('2025-10-09'),
      description:
        'Lessons from building a migration tool that has to run against live, high-traffic MongoDB clusters.',
      coAuthors: [],
    },
  ]);
}
