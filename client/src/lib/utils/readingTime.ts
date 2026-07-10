/** Formats the `readingTimeMinutes` computed server-side (see server Article model) for display. */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
