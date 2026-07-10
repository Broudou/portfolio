import { fail } from '@sveltejs/kit';
import { createContactMessageSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { submitContactMessage } from '$lib/api/contact.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      // Honeypot — real visitors never fill this in (hidden via CSS).
      website: formData.get('website') ?? '',
    };

    const parsed = createContactMessageSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        values: raw,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (parsed.data.website) {
      // Honeypot tripped — pretend success without actually sending anything.
      return { success: true };
    }

    try {
      await submitContactMessage(parsed.data);
      return { success: true };
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(err.status, { values: raw, message: err.message });
      }
      throw err;
    }
  },
};
