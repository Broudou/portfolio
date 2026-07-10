const WORDS_PER_MINUTE = 200;

/** Rough reading-time estimate from raw markdown word count (rounded up to at least 1 minute). */
export function calculateReadingTimeMinutes(markdown: string): number {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
