import { Biography } from '../../models/index.js';

const BIO_MARKDOWN = `I'm a composer and multidisciplinary artist working across ambient and
electronic music, site-specific sound installation, and mixed-media painting.
Most of what I make starts the same way: recording a place, then figuring out
what it wants to become.

I trained as a classical percussionist before drifting toward modular
synthesis and field recording in my early twenties, drawn less to precision
and more to the accidents you can't compose on purpose. That instinct still
shapes everything I make — the record, the installation, and the painting
series usually trace back to the same handful of coastal recording trips.

Most recently I've been building sound installations for spaces that weren't
designed to be listened to — water tanks, stairwells, disused industrial
buildings — and letting the room's own acoustics do as much of the
composition as I do. I also run a monthly unrehearsed performance series with
rotating collaborators, because I've learned more about listening from an
improvised set than from months alone in the studio.

Outside of my own work I teach a field-recording workshop a few times a year,
volunteer with a small community radio station's experimental music show, and
keep a running archive of unreleased material that occasionally surfaces as a
limited cassette.`;

export async function seedBiography(avatarId: string): Promise<void> {
  await Biography.create({
    singletonKey: 'main',
    fullName: 'Nadia Voss',
    headline: 'Composer & Multidisciplinary Artist — Sound, Installation & Painting',
    summary:
      'I make ambient music, site-specific sound installations, and mixed-media paintings, most of it built from the same coastal field recordings.',
    bioMarkdown: BIO_MARKDOWN,
    avatar: avatarId,
    location: 'Lisbon, Portugal',
    highlights: [
      'Released three albums, including Tidal Drift on cassette and digital',
      'Commissioned sound installation "Underneath" drew over 2,000 visitors across a three-week run',
      'Curates and performs in Nocturne Sessions, a monthly unrehearsed collaborative performance series',
      'Work shown in a five-artist group exhibition on coastal landscape',
    ],
    seo: {
      title: 'Nadia Voss — Composer & Multidisciplinary Artist',
      description:
        'Biography of Nadia Voss, a composer and multidisciplinary artist working in ambient music, sound installation, and mixed-media painting.',
      ogImage: avatarId,
    },
  });
}
