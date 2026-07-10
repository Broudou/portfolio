import type { PageServerLoad } from './$types.js';
import { listTimelineEvents } from '$lib/api/timeline.js';

export const load: PageServerLoad = async () => {
  const events = await listTimelineEvents();
  return { events: events.slice().reverse() };
};
