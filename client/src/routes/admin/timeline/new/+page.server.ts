import { fail, redirect } from '@sveltejs/kit';
import { createTimelineEventSchema } from '@portfolio/shared';
import type { Actions } from './$types.js';
import { createTimelineEvent } from '$lib/api/timeline.js';
import { parseTimelineEventForm } from '$lib/server/parseTimelineEventForm.js';
import { ApiClientError } from '$lib/api/client.js';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createTimelineEventSchema.safeParse(parseTimelineEventForm(formData));
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await createTimelineEvent(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }

    throw redirect(303, '/admin/timeline');
  },
};
