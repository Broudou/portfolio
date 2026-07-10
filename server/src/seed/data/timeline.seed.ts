import { TimelineEvent } from '../../models/index.js';

const EVENTS = [
  {
    title: 'B.Sc. Computer Science, Technical University',
    description:
      'Graduated with a focus on distributed systems and databases; thesis on consistency models for replicated logs.',
    date: new Date('2016-07-01'),
    type: 'education' as const,
  },
  {
    title: 'Software Engineer, Streamline Systems',
    description:
      'First engineering role — backend services for a logistics platform, primarily in Node.js and PostgreSQL.',
    date: new Date('2016-09-01'),
    type: 'work' as const,
  },
  {
    title: 'Promoted to Software Engineer II',
    description: 'Took ownership of the payments-reconciliation service after leading its rewrite.',
    date: new Date('2018-06-01'),
    type: 'work' as const,
  },
  {
    title: 'Open-sourced tracing-lite',
    description:
      'Released a lightweight Node.js tracing propagation library; it has since been adopted by several small teams.',
    date: new Date('2019-04-01'),
    type: 'achievement' as const,
    link: 'https://github.com/johndoe/tracing-lite',
  },
  {
    title: 'First conference talk — "Tracing Without the Ceremony"',
    description: 'Spoke at a regional backend engineering meetup about incremental observability adoption.',
    date: new Date('2021-05-14'),
    type: 'talk' as const,
  },
  {
    title: 'Senior Software Engineer, Northwind Cloud',
    description: 'Joined the platform team, focusing on internal developer tooling and service reliability.',
    date: new Date('2022-01-10'),
    type: 'work' as const,
  },
  {
    title: 'Built the internal Observability Platform',
    description: 'Led the project from proposal to org-wide adoption across eight teams.',
    date: new Date('2023-09-01'),
    type: 'project' as const,
  },
  {
    title: 'Published "Practical Distributed Tracing" — engineering journal',
    description: 'A written deep-dive on incremental tracing adoption, later cited internally as onboarding material.',
    date: new Date('2024-03-01'),
    type: 'achievement' as const,
  },
  {
    title: 'Started mentoring two early-career engineers',
    description: 'Ongoing structured mentorship focused on system design and code review skills.',
    date: new Date('2025-02-01'),
    type: 'achievement' as const,
  },
  {
    title: 'Leading the Schema Migrator CLI initiative',
    description:
      'Currently building a zero-downtime MongoDB migration tool, in internal beta with the platform team.',
    date: new Date('2026-03-01'),
    type: 'project' as const,
  },
];

export async function seedTimeline(): Promise<void> {
  await TimelineEvent.insertMany(EVENTS);
}
