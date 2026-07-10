import { Biography } from '../../models/index.js';

const BIO_MARKDOWN = `I'm a backend-leaning full-stack engineer who has spent the last decade building
systems that need to stay correct under load: payment pipelines, event-driven
services, and the occasional database migration that couldn't afford downtime.

I started out writing small Python scripts to automate parts of my university's
lab equipment bookings, which turned into an obsession with the boring-but-critical
parts of software: schema design, observability, and the kind of error handling
that turns a 3am page into a next-morning ticket.

Most recently I've been focused on distributed tracing and API contract design —
making sure that when five services touch one request, you can still answer
"what happened?" in under a minute. I care a lot about developer experience too:
a fast local dev loop and a typed API contract save more time than almost any
other investment a team can make.

Outside of work I mentor early-career engineers, contribute to a couple of open
source observability tools, and occasionally speak at local meetups about
pragmatic system design — the kind that survives contact with a real incident.`;

export async function seedBiography(avatarId: string): Promise<void> {
  await Biography.create({
    singletonKey: 'main',
    fullName: 'John Doe',
    headline: 'Senior Software Engineer — Distributed Systems & Developer Platforms',
    summary:
      'I build reliable backend systems and the developer tooling that keeps teams shipping them safely.',
    bioMarkdown: BIO_MARKDOWN,
    avatar: avatarId,
    location: 'Berlin, Germany',
    skills: [
      'TypeScript',
      'Node.js',
      'MongoDB',
      'PostgreSQL',
      'Distributed Systems',
      'API Design',
      'Docker',
      'Kubernetes',
      'Observability',
      'SvelteKit',
      'System Design',
      'Mentoring',
    ],
    highlights: [
      'Led the migration of a monolith to 12 independently deployable services with zero customer-facing downtime',
      'Built an internal observability platform adopted by 8 engineering teams',
      'Speaker at 3 regional engineering conferences on distributed tracing',
      'Maintainer of two open-source Node.js observability libraries',
    ],
    seo: {
      title: 'John Doe — Senior Software Engineer',
      description:
        'Biography of John Doe, a senior software engineer specializing in distributed systems and developer platforms.',
      ogImage: avatarId,
    },
  });
}
