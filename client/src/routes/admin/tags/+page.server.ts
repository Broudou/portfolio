import { fail } from '@sveltejs/kit';
import { createTagSchema, updateTagSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { createTag, deleteTag, listTags, updateTag } from '$lib/api/tags.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async () => {
  const tags = await listTags();
  return { tags };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createTagSchema.safeParse({ name: formData.get('name') });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await createTag(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { created: true };
  },

  update: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    const parsed = updateTagSchema.safeParse({ name: formData.get('name') });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await updateTag(locals.token!, id, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { updated: true };
  },

  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    try {
      await deleteTag(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
