import type { HydratedDocument } from 'mongoose';
import { Article } from '../../models/index.js';
import { slugify } from '../../services/slug.service.js';
import type { CategoryDocument } from '../../models/Category.model.js';
import type { TagDocument } from '../../models/Tag.model.js';

interface SeedContext {
  authorId: string;
  categories: Record<string, HydratedDocument<CategoryDocument>>;
  tags: Record<string, HydratedDocument<TagDocument>>;
  media: Record<string, { id: string }>;
}

export async function seedArticles(ctx: SeedContext): Promise<void> {
  const { authorId, categories, tags, media } = ctx;

  const articles = [
    {
      title: 'Building a Palette of Field Recordings',
      excerpt:
        'You do not need a studio full of gear to start an ambient record. Here is how two winters of coastal recordings became the raw material for an album.',
      contentMarkdown: `Most people picture a laptop and a synth when they think about starting an
ambient record. Mine started with a pair of hydrophones, a shotgun mic, and a
lot of cold mornings on the coast.

## Record more than you think you need

For every minute that ended up on the record, I probably recorded fifteen
that didn't. Tide changes, wind direction, and the state of the harbor all
change what a location sounds like hour to hour — you can't know in advance
which take will have the texture you actually want.

## Catalog while it's still fresh

I log every recording the same day: location, weather, time of day, and one
line on what stood out. Months later, scrolling through a folder of
identically named .wav files, that one line is the difference between finding
the right texture in five minutes and re-listening to four hours of audio.

## Let the source material lead

The instinct is to treat field recordings as texture under a "real"
composition. The tracks that ended up feeling most alive were the ones where
I let the recording's own rhythm and pitch content suggest the melodic
material, instead of the other way around.

## When to stop collecting

At some point more recordings stopped adding new information — I was just
re-recording the same handful of textures with worse weather. That was the
signal to move from gathering into arranging.`,
      category: categories.Music.id,
      tagNames: ['Field Recording', 'Ambient'],
      coverImage: media['article-field-recordings'].id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2025-09-12'),
    },
    {
      title: 'Scoring for a Room That Talks Back',
      excerpt:
        'Designing sound for a 12-meter concrete water tank meant writing with a nine-second reverb tail as a collaborator, not an obstacle.',
      contentMarkdown: `When I got the brief for Underneath, the first site visit mattered more than
any amount of studio time afterward. The tank's reverb tail is close to nine
seconds — long enough that a piece written for a normal room falls apart
completely once it's inside.

## Test on site, early

Anything that sounded clean and detailed on studio monitors turned into an
indistinct wash inside the tank. I brought a portable rig out for three test
sessions before writing a single "final" sound, just to build intuition for
how sparse the material needed to be.

\`\`\`
[contact mic] -> [envelope follower] -> [grain density] -> [4ch spatializer]
\`\`\`

## Sparse is a feature, not a compromise

Once I stopped trying to out-detail the room and instead used single,
widely-spaced events, the space did most of the work. A single struck object
would bloom into something the tank itself effectively composed.

## The visitor is part of the system

Footstep vibration through the floor fed the patch in real time, so no two
visits sounded quite the same. That unpredictability was the whole point —
a fixed stereo mix would have fought the space instead of using it.`,
      category: categories['Sound Installation'].id,
      tagNames: ['Installation', 'Sound Design'],
      coverImage: media['article-scoring-for-a-room'].id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2025-11-03'),
    },
    {
      title: 'What Nine Unrehearsed Shows Taught Me About Listening',
      excerpt:
        'Nine months into a no-rehearsal performance series, the lesson has had less to do with playing and more to do with getting out of the way.',
      contentMarkdown: `Nocturne Sessions started as an experiment: invite a musician I'd never
played with, skip rehearsal entirely, and improvise a full set live. Nine
sessions in, the format has taught me more about listening than about
playing.

## The first ten minutes are the hardest

Every session opens tentative — both of us testing for space, half-expecting
to step on each other. The sets that turned out best were the ones where I
resisted the urge to fill that tentative silence with material and let it run
a beat longer than felt comfortable.

## Plan the shape, not the notes

We agree on a rough arc beforehand — where it opens, where it might build,
roughly how long — but never specific parts. That loose scaffolding is enough
to keep a 40-minute improvisation from wandering, without dictating what
either of us plays.

## Some nights just don't land, and that's the deal

Not every session is a keeper. Publishing a quarterly tape instead of every
recording means the format can absorb an off night without either of us
feeling like we need to salvage it live.`,
      category: categories.Performance.id,
      tagNames: ['Improvisation', 'Collaboration'],
      coverImage: media['article-nine-unrehearsed-shows'].id,
      status: 'published' as const,
      featured: false,
      publishedAt: new Date('2026-01-20'),
    },
    {
      title: 'Sketchbook: Starting the Sediment Series (Draft)',
      excerpt:
        'Early notes on a new mixed-media painting series, written while the work is still taking shape.',
      contentMarkdown: `Working notes while the Sediment panels are still in progress — mostly so I
remember why I made certain decisions once the series is finished and the
early reasoning has blurred.

## What's working

- Sanding back each layer before adding the next keeps earlier marks visible
  without it reading as muddy
- Torn paper collaged into the wet ground holds pigment differently than the
  panel itself, which is giving some useful unplanned texture

## Open questions

- Still deciding whether the larger panels (100x140cm) need a different
  layering rhythm than the small studies, or whether that's overthinking it
- Considering sound as a companion piece for the eventual show — unresolved

More once there's enough distance from the work to judge it properly.`,
      category: categories['Visual Art'].id,
      tagNames: ['Painting', 'Mixed Media'],
      coverImage: media['article-sediment-sketchbook'].id,
      status: 'draft' as const,
      featured: false,
      publishedAt: null,
    },
  ];

  for (const article of articles) {
    const { tagNames, ...rest } = article;
    await Article.create({
      ...rest,
      slug: slugify(article.title),
      author: authorId,
      tags: tagNames.map((name) => tags[name]?.id).filter(Boolean),
    });
  }
}
