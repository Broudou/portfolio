import { fail } from '@sveltejs/kit';
import { createCategorySchema, updateCategorySchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import { createCategory, deleteCategory, listCategories, updateCategory } from '$lib/api/categories.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async () => {
  const categories = await listCategories();
  return { categories };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createCategorySchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      appliesTo: formData.get('appliesTo'),
    });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await createCategory(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { created: true };
  },

  update: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    const parsed = updateCategorySchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      appliesTo: formData.get('appliesTo'),
    });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await updateCategory(locals.token!, id, parsed.data);
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
      await deleteCategory(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },
};
