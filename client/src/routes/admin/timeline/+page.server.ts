import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { deleteTimelineEvent, listTimelineEvents } from '$lib/api/timeline.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async () => {
  const events = await listTimelineEvents();
  return { events: events.slice().reverse() };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deleteTimelineEvent(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
