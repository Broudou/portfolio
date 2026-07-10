import { error, fail, redirect } from '@sveltejs/kit';
import { updateTimelineEventSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { listTimelineEvents, updateTimelineEvent } from '$lib/api/timeline.js';
import { parseTimelineEventForm } from '$lib/server/parseTimelineEventForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ params }) => {
  const events = await listTimelineEvents();
  const event = events.find((item) => item.id === params.id);
  if (!event) throw error(404, 'Timeline event not found');
  return { event };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const formData = await request.formData();
    const parsed = updateTimelineEventSchema.safeParse(parseTimelineEventForm(formData));
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await updateTimelineEvent(locals.token!, params.id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/timeline');
  },
};
