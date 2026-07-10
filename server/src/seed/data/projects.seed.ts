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
      title: 'Observability Platform',
      summary:
        'An internal distributed-tracing and metrics platform built on OpenTelemetry, adopted by eight engineering teams.',
      descriptionMarkdown: `## The problem

Our services were emitting logs, but nobody could answer "what happened to this
request across five services?" in under twenty minutes. Incident response was
slow, and postmortems kept surfacing the same root cause: no shared tracing story.

## What I built

I led a small team building an OpenTelemetry-based collection pipeline, a
Node.js ingestion service backed by MongoDB for trace storage, and a
lightweight UI for querying traces by request ID, service, or latency
percentile.

\`\`\`ts
export function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const span = tracer.startSpan(name);
  return fn()
    .then((result) => { span.setStatus({ code: SpanStatusCode.OK }); return result; })
    .finally(() => span.end());
}
\`\`\`

## Impact

- Mean time to root-cause dropped from ~24 minutes to ~6 minutes across the org
- Adopted by 8 teams within the first two quarters
- Became the basis for a follow-up SLO dashboard project`,
      category: categories.Backend.id,
      tagNames: ['Node.js', 'TypeScript', 'MongoDB', 'System Design'],
      coverImage: media['project-observability'].id,
      techStack: ['Node.js', 'TypeScript', 'MongoDB', 'OpenTelemetry', 'Docker'],
      role: 'Tech Lead',
      links: { repoUrl: 'https://github.com/johndoe/observability-platform' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-09-01'),
      order: 0,
    },
    {
      title: 'Edge Cache Router',
      summary:
        'A geo-aware caching layer that cut median API latency by 40% for international users.',
      descriptionMarkdown: `## Context

Our API's median latency for users outside our primary region was over 400ms —
mostly network round-trip time, not compute. Adding more compute wasn't going
to fix a speed-of-light problem.

## Approach

I designed and built a thin edge-caching router deployed to five regional
points of presence. Cache invalidation is event-driven: write-path services
publish invalidation events to a lightweight pub/sub layer, which the edge
nodes subscribe to.

## Results

- Median latency for non-primary-region users dropped from ~420ms to ~180ms
- Cache hit rate stabilized around 87% for read-heavy endpoints
- Zero stale-data incidents in the six months after rollout`,
      category: categories.DevOps.id,
      tagNames: ['Docker', 'Kubernetes', 'Performance'],
      coverImage: media['project-edge-cache'].id,
      techStack: ['Node.js', 'Redis', 'Kubernetes', 'Envoy'],
      role: 'Backend Engineer',
      links: { repoUrl: 'https://github.com/johndoe/edge-cache-router' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2022-03-01'),
      endDate: new Date('2022-07-20'),
      order: 1,
    },
    {
      title: 'TaskFlow API',
      summary: 'A typed, event-driven task orchestration API used by three internal products.',
      descriptionMarkdown: `## Overview

TaskFlow is a task orchestration API that lets internal product teams define
multi-step workflows (e.g. "onboard a new customer") as declarative graphs,
with automatic retries, dead-letter handling, and full audit trails.

## Design choices

The API is fully typed end-to-end using a shared TypeScript contract package,
so client teams get compile-time errors instead of runtime surprises when a
workflow shape changes.

\`\`\`ts
interface WorkflowStep<Input, Output> {
  name: string;
  run: (input: Input) => Promise<Output>;
  retry?: { attempts: number; backoffMs: number };
}
\`\`\`

## Adoption

Three internal product teams now run their onboarding, billing-reconciliation,
and data-export workflows on TaskFlow instead of bespoke cron jobs.`,
      category: categories.Backend.id,
      tagNames: ['TypeScript', 'Node.js', 'Testing'],
      coverImage: media['project-taskflow'].id,
      techStack: ['TypeScript', 'Express', 'MongoDB', 'BullMQ'],
      role: 'Backend Engineer',
      links: { repoUrl: 'https://github.com/johndoe/taskflow-api', liveUrl: '' },
      status: 'published' as const,
      featured: true,
      startDate: new Date('2021-06-01'),
      endDate: new Date('2021-11-15'),
      order: 2,
    },
    {
      title: 'Design System Kit',
      summary:
        'A shared component + token library that unified visual language across four product surfaces.',
      descriptionMarkdown: `## Why

Four separate product teams had drifted into four subtly different button
styles, spacing scales, and color palettes. New engineers couldn't tell which
was "correct."

## What shipped

A token-driven component library (Svelte + CSS custom properties) with
documented usage guidelines, accessibility checks baked into CI, and a
Storybook-style visual review process.

## Outcome

Adopted across all four product surfaces within two quarters, cutting new
feature UI review time roughly in half.`,
      category: categories.Frontend.id,
      tagNames: ['SvelteKit', 'Accessibility', 'TypeScript'],
      coverImage: media['project-designsystem'].id,
      techStack: ['Svelte', 'TypeScript', 'Vite', 'Storybook'],
      role: 'Frontend Engineer',
      links: { repoUrl: 'https://github.com/johndoe/design-system-kit' },
      status: 'published' as const,
      featured: false,
      startDate: new Date('2020-09-01'),
      endDate: new Date('2021-02-01'),
      order: 3,
    },
    {
      title: 'Schema Migrator CLI',
      summary: 'A zero-downtime schema migration tool for MongoDB, currently in internal beta.',
      descriptionMarkdown: `## Status: draft / internal beta

A CLI tool for expressing MongoDB schema migrations as versioned, reversible
steps, with a dry-run mode that reports estimated document counts affected
before anything runs against production.

This project is still evolving — expect the CLI surface to change before a
public release.`,
      category: categories.Backend.id,
      tagNames: ['MongoDB', 'Node.js'],
      coverImage: media['project-migrator'].id,
      techStack: ['Node.js', 'TypeScript', 'MongoDB'],
      role: 'Author',
      links: {},
      status: 'draft' as const,
      featured: false,
      startDate: new Date('2025-11-01'),
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
