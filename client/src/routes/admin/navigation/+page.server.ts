import { fail } from '@sveltejs/kit';
import { createNavigationItemSchema, updateNavigationItemSchema } from '@portfolio/shared';
import type { Actions, PageServerLoad } from './$types.js';
import {
  createNavigationItem,
  deleteNavigationItem,
  listAllNavigation,
  reorderNavigation,
  updateNavigationItem,
} from '$lib/api/navigation.js';
import { ApiClientError } from '$lib/api/client.js';

export const load: PageServerLoad = async ({ locals }) => {
  const items = await listAllNavigation(locals.token!);
  return { items };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const parsed = createNavigationItemSchema.safeParse({
      label: formData.get('label'),
      path: formData.get('path'),
      order: 999,
    });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await createNavigationItem(locals.token!, parsed.data);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { created: true };
  },

  update: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = String(formData.get('id'));
    const parsed = updateNavigationItemSchema.safeParse({
      label: formData.get('label'),
      path: formData.get('path'),
      isVisible: formData.get('isVisible') === 'on',
      openInNewTab: formData.get('openInNewTab') === 'on',
      isExternal: formData.get('isExternal') === 'on',
    });
    if (!parsed.success) return fail(400, { errors: parsed.error.flatten().fieldErrors });

    try {
      await updateNavigationItem(locals.token!, id, parsed.data);
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
      await deleteNavigationItem(locals.token!, id);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { deleted: true };
  },

  reorder: async ({ request, locals }) => {
    const formData = await request.formData();
    const orderedIds = String(formData.get('orderedIds') ?? '').split(',').filter(Boolean);
    const items = orderedIds.map((id, index) => ({ id, order: index }));

    try {
      await reorderNavigation(locals.token!, items);
    } catch (err) {
      if (err instanceof ApiClientError) return fail(err.status, { message: err.message });
      throw err;
    }
    return { reordered: true };
  },
};
